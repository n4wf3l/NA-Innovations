<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\User;
use App\Models\Quote;
use App\Models\Invoice;
use App\Models\Projet;
use App\Models\Commission;
use App\Models\NotificationLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

/**
 * Central workflow engine that automates cross-module business logic.
 *
 * This is the brain that connects Leads → Quotes → Clients → Invoices → Payments → Commissions.
 */
class WorkflowService
{
    // ─── QUOTE ACCEPTED ─────────────────────────────────────────────────
    /**
     * When a quote is marked as accepted:
     * 1. Lead → status "won" + won_at timestamp
     * 2. Lead → converted_client_id linked (create client if needed)
     * 3. Project created/linked
     * 4. Deposit invoice auto-generated
     */
    public static function onQuoteAccepted(Quote $quote): array
    {
        $actions = [];

        DB::transaction(function () use ($quote, &$actions) {
            $quote->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            $quote->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'status_change',
                'title' => 'Quote accepted',
                'description' => "Quote {$quote->quote_number} was accepted by {$quote->client_name}",
                'old_value' => $quote->getOriginal('status'),
                'new_value' => 'accepted',
            ]);

            // 1. Find or create the client
            $client = self::ensureClient($quote);
            if ($client) {
                $quote->update(['client_id' => $client->id]);
                $actions[] = 'client_linked';
            }

            // 2. Update the lead if linked
            if ($quote->lead_id) {
                $lead = Lead::find($quote->lead_id);
                if ($lead) {
                    $lead->update([
                        'status' => 'won',
                        'won_at' => now(),
                        'converted_client_id' => $client?->id,
                    ]);

                    $lead->timelineEvents()->create([
                        'user_id' => auth()->id(),
                        'event_type' => 'status_change',
                        'title' => 'Lead won',
                        'description' => "Lead converted via quote {$quote->quote_number}",
                        'old_value' => $lead->getOriginal('status'),
                        'new_value' => 'won',
                    ]);

                    $actions[] = 'lead_won';

                    // Notify referral partner
                    if ($lead->referral_partner_id) {
                        self::notifyPartner($lead, 'lead_won', "Your referral {$lead->first_name} {$lead->last_name} has been converted!");
                        $actions[] = 'partner_notified';
                    }
                }
            }

            // 3. Create project if none exists
            $project = self::ensureProject($quote, $client);
            if ($project) {
                $quote->update(['projet_id' => $project->id]);
                $actions[] = 'project_created';
            }

            // 4. Auto-generate deposit invoice
            if ($quote->deposit_amount > 0) {
                $invoice = QuoteService::convertToInvoice($quote, 'deposit');
                $invoice->update(['locale' => $quote->locale ?? 'fr']);
                $actions[] = 'deposit_invoice_created';
            }

            // Regenerate PDF with accepted status
            PdfService::generateQuotePdf($quote);
        });

        return $actions;
    }

    // ─── QUOTE REJECTED ─────────────────────────────────────────────────
    public static function onQuoteRejected(Quote $quote, ?string $reason = null): void
    {
        $quote->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
        ]);

        $quote->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'status_change',
            'title' => 'Quote rejected',
            'description' => $reason ? "Reason: {$reason}" : "Quote {$quote->quote_number} was rejected",
            'old_value' => $quote->getOriginal('status'),
            'new_value' => 'rejected',
        ]);

        // Update lead if linked
        if ($quote->lead_id) {
            $lead = Lead::find($quote->lead_id);
            if ($lead && !in_array($lead->status, ['won'])) {
                $lead->update([
                    'status' => 'lost',
                    'lost_at' => now(),
                    'lost_reason' => $reason ?? "Quote {$quote->quote_number} rejected",
                ]);
            }
        }
    }

    // ─── INVOICE FULLY PAID ─────────────────────────────────────────────
    /**
     * When an invoice is fully paid:
     * 1. If project exists → move to "in_progress" (if still in planning)
     * 2. Commission auto-calculated for referral partner
     */
    public static function onInvoiceFullyPaid(Invoice $invoice): array
    {
        $actions = [];

        // Update project status if applicable
        if ($invoice->projet_id) {
            $project = Projet::find($invoice->projet_id);
            if ($project && in_array($project->status, ['planning', null])) {
                $project->update(['status' => 'in_progress', 'start_date' => $project->start_date ?? now()->toDateString()]);
                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'status_change',
                    'title' => 'Project started',
                    'description' => "Project started after payment of {$invoice->invoice_number}",
                    'old_value' => 'planning',
                    'new_value' => 'in_progress',
                ]);
                $actions[] = 'project_started';
            }
        }

        return $actions;
    }

    // ─── LEAD STATUS CHANGED ────────────────────────────────────────────
    /**
     * Auto-set timestamps when lead status changes.
     */
    public static function onLeadStatusChanged(Lead $lead, string $oldStatus, string $newStatus): void
    {
        $timestamps = [
            'contacted' => 'contacted_at',
            'qualified' => 'qualified_at',
            'won' => 'won_at',
            'lost' => 'lost_at',
        ];

        if (isset($timestamps[$newStatus]) && !$lead->{$timestamps[$newStatus]}) {
            $lead->update([$timestamps[$newStatus] => now()]);
        }
    }

    // ─── PROJECT COMPLETED ──────────────────────────────────────────────
    /**
     * When a project is marked as completed:
     * 1. Check if a final invoice is needed
     * 2. Set end_date
     */
    public static function onProjectCompleted(Projet $project): array
    {
        $actions = [];

        $project->update([
            'status' => 'completed',
            'end_date' => $project->end_date ?? now()->toDateString(),
        ]);

        // Check if there's a quote with a final invoice pending
        $quote = $project->quotes()->latest()->first();
        if ($quote) {
            $hasFinalInvoice = Invoice::where('quote_id', $quote->id)->where('type', 'final')->exists();
            if (!$hasFinalInvoice && $quote->total > ($quote->deposit_amount ?? 0)) {
                $actions[] = 'final_invoice_suggested';
            }
        }

        return $actions;
    }

    // ─── OVERDUE INVOICE CHECK (Schedulable) ────────────────────────────
    /**
     * Mark invoices as overdue if past due date. Run via scheduler.
     */
    public static function checkOverdueInvoices(): int
    {
        $count = Invoice::where('status', 'sent')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        $count += Invoice::where('status', 'partially_paid')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        return $count;
    }

    // ─── HELPER: Ensure Client Exists ───────────────────────────────────
    private static function ensureClient(Quote $quote): ?User
    {
        // If client_id already set and valid, return it
        if ($quote->client_id) {
            $existing = User::find($quote->client_id);
            if ($existing) return $existing;
        }

        // Try to find by email
        $existing = User::where('email', $quote->client_email)
            ->where('role', 'client')
            ->first();

        if ($existing) return $existing;

        // Create new client from quote data
        if (!$quote->client_email) return null;

        $client = User::create([
            'name' => $quote->client_name,
            'email' => $quote->client_email,
            'password' => bcrypt(\Illuminate\Support\Str::random(16)),
            'company_name' => $quote->client_company,
            'address' => $quote->client_address,
            'vat_number' => $quote->client_vat,
            'role' => 'client',
            'is_active' => true,
            'last_login_at' => now(),
        ]);

        // Send password reset link so client can set their own password
        try {
            Password::sendResetLink(['email' => $client->email]);
        } catch (\Exception $e) {
            Log::warning("Failed to send welcome email to client {$client->email}: {$e->getMessage()}");
        }

        return $client;
    }

    // ─── HELPER: Ensure Project Exists ──────────────────────────────────
    private static function ensureProject(Quote $quote, ?User $client): ?Projet
    {
        // If quote already linked to a project, return it
        if ($quote->projet_id) {
            return Projet::find($quote->projet_id);
        }

        // Find the lead to get referral info
        $lead = $quote->lead_id ? Lead::find($quote->lead_id) : null;

        return Projet::create([
            'nom_societe' => $quote->client_company ?: $quote->client_name,
            'type_site' => $quote->title,
            'client_id' => $client?->id,
            'lead_id' => $lead?->id,
            'status' => 'planning',
            'budget' => $quote->total,
            'description' => $quote->scope_of_work,
        ]);
    }

    // ─── HELPER: Notify Partner ─────────────────────────────────────────
    private static function notifyPartner(Lead $lead, string $type, string $message): void
    {
        try {
            $partner = $lead->referralPartner;
            if (!$partner || !$partner->user) return;

            NotificationLog::create([
                'user_id' => $partner->user->id,
                'type' => $type,
                'title' => 'Referral Update',
                'message' => $message,
                'is_read' => false,
            ]);
        } catch (\Exception $e) {
            Log::warning("Failed to notify partner: {$e->getMessage()}");
        }
    }
}
