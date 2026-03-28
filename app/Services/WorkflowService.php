<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\User;
use App\Models\Quote;
use App\Models\Invoice;
use App\Models\Projet;
use App\Models\Commission;
use App\Models\NotificationLog;
use App\Models\RecurringService;
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
        // Guard: prevent double processing if quote is already accepted
        if ($quote->status === 'accepted') {
            Log::warning("onQuoteAccepted called on already accepted quote {$quote->quote_number} (ID: {$quote->id}). Skipping.");
            return [];
        }

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
                        $partner = $lead->referralPartner;
                        if ($partner && $partner->user) {
                            NotificationService::send(
                                $partner->user,
                                'lead-won-partner',
                                [
                                    'partner_name' => $partner->user->name,
                                    'client_name' => "{$lead->first_name} {$lead->last_name}",
                                    'project_name' => $quote->title,
                                    'commission_rate' => $partner->default_commission_rate,
                                ],
                                actionUrl: '/partner/commissions',
                            );
                        }
                        $actions[] = 'partner_notified';
                    }

                    // Notify admins
                    NotificationService::sendToAdmins(
                        'quote-accepted-admin',
                        [
                            'client_name' => $quote->client_name,
                            'quote_number' => $quote->quote_number,
                            'total' => number_format($quote->total, 2, ',', '.') . ' EUR',
                            'project_name' => $quote->title,
                        ],
                        transactional: true,
                        actionUrl: "/admin/quotes/{$quote->id}",
                    );
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

        // Notify admins
        NotificationService::sendToAdmins(
            'quote-rejected-admin',
            [
                'client_name' => $quote->client_name,
                'quote_number' => $quote->quote_number,
                'reason' => $reason ?? 'No reason provided',
            ],
            transactional: true,
            actionUrl: "/admin/quotes/{$quote->id}",
        );
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

                // Notify client of project start
                if ($project->client_id) {
                    $client = User::find($project->client_id);
                    if ($client) {
                        NotificationService::send($client, 'project-status-update', [
                            'client_name' => $client->name,
                            'project_name' => $project->nom_societe,
                            'old_status' => 'Planning',
                            'new_status' => 'In Progress',
                        ], actionUrl: "/client/projects/{$project->id}");
                    }
                }
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

        // Notify client
        if ($project->client_id) {
            $client = User::find($project->client_id);
            if ($client) {
                NotificationService::send($client, 'project-completed', [
                    'client_name' => $client->name,
                    'project_name' => $project->nom_societe,
                ], actionUrl: "/client/projects/{$project->id}");
            }
        }

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
        // Get invoices that will become overdue (before bulk update)
        $newlyOverdue = Invoice::whereIn('status', ['sent', 'partially_paid'])
            ->where('due_date', '<', now()->toDateString())
            ->get();

        $count = Invoice::where('status', 'sent')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        $count += Invoice::where('status', 'partially_paid')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        // Send overdue reminders
        foreach ($newlyOverdue as $invoice) {
            if ($invoice->client_id) {
                $client = User::find($invoice->client_id);
                if ($client) {
                    $daysOverdue = (int) now()->diffInDays($invoice->due_date);
                    NotificationService::send($client, 'invoice-overdue', [
                        'client_name' => $invoice->client_name,
                        'invoice_number' => $invoice->invoice_number,
                        'total' => number_format($invoice->amount_due, 2, ',', '.') . ' EUR',
                        'due_date' => $invoice->due_date->format('d/m/Y'),
                        'days_overdue' => $daysOverdue,
                    ], transactional: true);
                }
            }
        }

        return $count;
    }

    // ─── AUTO-RENEW EXPIRED SERVICES (Schedulable) ──────────────────
    /**
     * Auto-renew services with auto_renew=true that have expired.
     * Extends expiry_date by the frequency interval and logs a timeline event.
     */
    public static function autoRenewServices(): int
    {
        $services = RecurringService::where('auto_renew', true)
            ->whereIn('status', ['active', 'expiring_soon'])
            ->where('expiry_date', '<=', now()->toDateString())
            ->get();

        foreach ($services as $service) {
            $newExpiry = self::addFrequencyInterval($service->expiry_date, $service->frequency);

            $oldExpiry = $service->expiry_date->format('d/m/Y');
            $service->update([
                'expiry_date' => $newExpiry,
                'purchase_date' => now()->toDateString(),
                'status' => 'active',
            ]);

            // Log renewal on the project
            if ($service->projet_id) {
                $project = Projet::find($service->projet_id);
                $project?->timelineEvents()->create([
                    'user_id' => null,
                    'event_type' => 'renewal',
                    'title' => "Service renewed: {$service->name}",
                    'description' => "Auto-renewed from {$oldExpiry} to {$newExpiry->format('d/m/Y')}",
                ]);
            }

            // Notify all admins
            self::notifyAdmins(
                'service_renewed',
                "Service renewed: {$service->name}",
                "{$service->name} ({$service->provider}) auto-renewed until {$newExpiry->format('d/m/Y')}. Cost: €" . number_format($service->real_cost, 2),
                "/admin/services/{$service->id}"
            );
        }

        // Mark services that expired and are NOT auto-renew as 'expired'
        $expiredServices = RecurringService::where('auto_renew', false)
            ->whereIn('status', ['active', 'expiring_soon'])
            ->where('expiry_date', '<', now()->toDateString())
            ->get();

        foreach ($expiredServices as $service) {
            $service->update(['status' => 'expired']);
            self::notifyAdmins(
                'service_expired',
                "Service expired: {$service->name}",
                "{$service->name} ({$service->provider}) has expired and is NOT set to auto-renew. Action required.",
                "/admin/services/{$service->id}"
            );
        }

        // Mark services expiring within alert_days_before as 'expiring_soon'
        RecurringService::where('status', 'active')
            ->whereRaw('expiry_date <= DATE_ADD(CURDATE(), INTERVAL alert_days_before DAY)')
            ->where('expiry_date', '>', now()->toDateString())
            ->update(['status' => 'expiring_soon']);

        return $services->count();
    }

    // ─── TIERED SERVICE EXPIRY NOTIFICATIONS (Schedulable) ──────────
    /**
     * Send notifications at key milestones before service expiry.
     * Runs daily — each notification is sent only once (dedup by type+service+days).
     */
    public static function sendServiceExpiryNotifications(): void
    {
        $tiers = [
            ['days' => 60, 'label' => '2 months'],
            ['days' => 30, 'label' => '1 month'],
            ['days' => 7,  'label' => '1 week'],
            ['days' => 1,  'label' => 'tomorrow'],
        ];

        $services = RecurringService::whereIn('status', ['active', 'expiring_soon'])
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '>', now()->toDateString())
            ->where('expiry_date', '<=', now()->addDays(61)->toDateString())
            ->with(['client', 'projet'])
            ->get();

        foreach ($services as $service) {
            $daysLeft = (int) now()->startOfDay()->diffInDays($service->expiry_date, false);

            foreach ($tiers as $tier) {
                if ($daysLeft !== $tier['days']) continue;

                $dedupKey = "service_expiry_{$tier['days']}d_{$service->id}";

                // Check if this notification was already sent (dedup)
                $alreadySent = NotificationLog::where('type', $dedupKey)
                    ->where('created_at', '>=', now()->subDays(max($tier['days'] - 1, 1)))
                    ->exists();

                if ($alreadySent) continue;

                $projectName = $service->projet?->nom_societe ?? '';
                $context = $projectName ? " ({$projectName})" : '';

                // Notify admins
                self::notifyAdmins(
                    $dedupKey,
                    "Service alert: {$service->name} expires in {$tier['label']}",
                    "{$service->name}{$context} — {$service->provider} — expires {$service->expiry_date->format('d/m/Y')}" .
                    ($service->auto_renew ? ' (auto-renew ON)' : ' — ACTION REQUIRED'),
                    "/admin/services/{$service->id}"
                );

                // Notify client if project has one
                if ($service->projet?->client_id) {
                    NotificationLog::create([
                        'user_id' => $service->projet->client_id,
                        'type' => $dedupKey,
                        'title' => "Service expiring: {$service->name}",
                        'message' => "Your {$service->name} service expires in {$tier['label']} ({$service->expiry_date->format('d/m/Y')})" .
                            ($service->auto_renew ? '. It will be renewed automatically.' : '. Please contact us to renew.'),
                        'action_url' => "/client/projects/{$service->projet_id}",
                        'is_read' => false,
                    ]);
                }
            }
        }
    }

    // ─── HELPER: Add frequency interval to date ─────────────────────
    private static function addFrequencyInterval($date, string $frequency)
    {
        return match ($frequency) {
            'monthly' => $date->copy()->addMonth(),
            'quarterly' => $date->copy()->addMonths(3),
            'semi_annual' => $date->copy()->addMonths(6),
            'annual' => $date->copy()->addYear(),
            'biennial' => $date->copy()->addYears(2),
            'triennial' => $date->copy()->addYears(3),
            default => $date->copy()->addYear(),
        };
    }

    // ─── HELPER: Notify all admin users ─────────────────────────────
    private static function notifyAdmins(string $type, string $title, string $message, ?string $actionUrl = null): void
    {
        $admins = User::where('role', 'admin')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            NotificationLog::create([
                'user_id' => $admin->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'action_url' => $actionUrl,
                'is_read' => false,
            ]);
        }
    }

    // ─── HELPER: Ensure Client Exists ───────────────────────────────────
    private static function ensureClient(Quote $quote): ?User
    {
        // If client_id already set and valid, return it
        if ($quote->client_id) {
            $existing = User::find($quote->client_id);
            if ($existing) return $existing;
        }

        // Try to find by email (any role)
        if (!$quote->client_email) return null;

        $existing = User::where('email', $quote->client_email)->first();

        if ($existing) {
            if ($existing->role !== 'client') {
                Log::warning("ensureClient: email {$quote->client_email} already belongs to a non-client user (role: {$existing->role}, ID: {$existing->id}). Skipping client creation.");
                return null;
            }
            return $existing;
        }

        // Create new client from quote data

        $client = User::create([
            'name' => $quote->client_name,
            'email' => $quote->client_email,
            'password' => bcrypt(\Illuminate\Support\Str::random(32)),
            'company_name' => $quote->client_company,
            'address' => $quote->client_address,
            'vat_number' => $quote->client_vat,
            'role' => 'client',
            'is_active' => true,
            'approved_at' => now(),
        ]);

        // Send welcome email via NotificationService
        NotificationService::send($client, 'client-welcome', [
            'client_name' => $client->name,
            'email' => $client->email,
            'portal_url' => url('/login'),
        ], transactional: true);

        // Send password reset link so client can set their own password
        try {
            Password::sendResetLink(['email' => $client->email]);
        } catch (\Exception $e) {
            Log::warning("Failed to send password reset to client {$client->email}: {$e->getMessage()}");
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
