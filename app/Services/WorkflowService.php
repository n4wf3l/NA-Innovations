<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\User;
use App\Models\Quote;
use App\Models\Invoice;
use App\Models\InvoiceReminder;
use App\Models\Projet;
use App\Models\PurchaseOrder;
use App\Models\Commission;
use App\Models\DocumentTemplate;
use App\Models\ProjectDocument;
use App\Models\NotificationLog;
use App\Models\RecurringService;
use App\Models\ServiceRenewal;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

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

                    // Notify referral partner (in-app + email)
                    if ($lead->referral_partner_id) {
                        $partner = $lead->referralPartner;
                        if ($partner && $partner->user) {
                            // In-app notification
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

                            // Email notification (prepared for when mail driver is active)
                            self::notifyPartnerByEmail($partner->user, 'lead-won-partner', [
                                'partner_name' => $partner->user->name,
                                'client_name' => "{$lead->first_name} {$lead->last_name}",
                                'project_name' => $quote->title,
                                'commission_rate' => $partner->default_commission_rate,
                            ]);
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

            // 5. Auto-generate Purchase Order from quote
            try {
                $quote->load('items');
                $items = $quote->items->where('is_optional', false)->map(fn($item) => [
                    'description' => $item->description,
                    'details' => $item->details,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                ])->values()->toArray();

                $po = PurchaseOrder::create([
                    'quote_id' => $quote->id,
                    'client_id' => $client?->id,
                    'projet_id' => $project?->id,
                    'client_name' => $quote->client_name,
                    'client_email' => $quote->client_email,
                    'client_company' => $quote->client_company,
                    'client_address' => $quote->client_address,
                    'client_vat' => $quote->client_vat,
                    'items' => $items,
                    'subtotal' => $quote->subtotal,
                    'tax_rate' => $quote->tax_rate,
                    'tax_amount' => $quote->tax_amount,
                    'total' => $quote->total,
                    'currency' => $quote->currency ?? 'EUR',
                    'status' => 'confirmed',
                    'issue_date' => now()->toDateString(),
                    'locale' => $quote->locale ?? 'fr',
                ]);
                PdfService::generatePurchaseOrderPdf($po);
                $actions[] = 'purchase_order_created';
            } catch (\Exception $e) {
                Log::warning("Failed to generate purchase order: {$e->getMessage()}");
            }

            // Regenerate PDF with accepted status
            try {
                PdfService::generateQuotePdf($quote);
            } catch (\Exception $e) {
                Log::warning("Failed to regenerate quote PDF: {$e->getMessage()}");
            }
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
                $oldStatus = $lead->status;
                $lead->update([
                    'status' => 'lost',
                    'lost_at' => now(),
                    'lost_reason' => $reason ?? "Quote {$quote->quote_number} rejected",
                ]);

                // Notify referral partner of lead lost
                if ($lead->referral_partner_id) {
                    $partner = $lead->referralPartner;
                    if ($partner && $partner->user_id) {
                        NotificationLog::create([
                            'user_id' => $partner->user_id,
                            'type' => 'lead_status_update',
                            'title' => __('Statut du lead mis à jour'),
                            'message' => __('Votre lead :name est passé au statut :status', [
                                'name' => $lead->first_name . ' ' . $lead->last_name,
                                'status' => 'lost',
                            ]),
                            'action_url' => '/partner/leads/' . $lead->id,
                            'is_read' => false,
                        ]);
                    }
                }
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

        // Notify referral partner of lead status change
        if ($lead->referral_partner_id) {
            $partner = $lead->referralPartner;
            if ($partner && $partner->user_id) {
                NotificationLog::create([
                    'user_id' => $partner->user_id,
                    'type' => 'lead_status_update',
                    'title' => __('Statut du lead mis à jour'),
                    'message' => __('Votre lead :name est passé au statut :status', [
                        'name' => $lead->first_name . ' ' . $lead->last_name,
                        'status' => $newStatus,
                    ]),
                    'action_url' => '/partner/leads/' . $lead->id,
                    'is_read' => false,
                ]);
            }
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

        // Auto-generate delivery report (PV de réception)
        try {
            $template = DocumentTemplate::where('slug', 'delivery-report')->where('is_active', true)->first();
            if ($template) {
                $client = $project->client;
                $clientName = $client?->name ?? '';
                $clientCompany = $client?->company_name ?? '';

                $content = str_replace(
                    ['{{ client_name }}', '{{ client_company }}', '{{ project_name }}', '{{ delivery_date }}', '{{ deliverables }}', '{{ remarks }}'],
                    [$clientName, $clientCompany, $project->nom_societe, now()->format('d/m/Y'), __('Ensemble des livrables du projet'), __('Aucune réserve formulée')],
                    $template->body
                );

                $doc = $project->projectDocuments()->create([
                    'document_template_id' => $template->id,
                    'title' => __('Procès-verbal de réception') . ' - ' . $project->nom_societe,
                    'content' => $content,
                    'status' => 'draft',
                    'locale' => 'fr',
                ]);

                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'document_created',
                    'title' => __('Procès-verbal de réception généré'),
                    'description' => __('Le procès-verbal de réception a été généré automatiquement suite à la complétion du projet.'),
                ]);

                $actions[] = 'delivery_report_generated';
            }
        } catch (\Exception $e) {
            Log::warning("Failed to generate delivery report: {$e->getMessage()}");
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

            // Auto-generate invoice for the renewal if enabled
            $autoInvoice = Setting::get('service.auto_invoice_on_renewal', true);
            if ($autoInvoice && $service->auto_renew && $service->billed_price > 0) {
                try {
                    $invoice = Invoice::create([
                        'invoice_number' => NumberGenerator::generateInvoiceNumber(),
                        'title' => "Renouvellement service : {$service->name}",
                        'client_id' => $service->projet?->client_id,
                        'client_name' => $service->projet?->client?->name ?? 'N/A',
                        'client_email' => $service->projet?->client?->email ?? '',
                        'projet_id' => $service->projet_id,
                        'type' => 'standard',
                        'status' => 'sent',
                        'tax_rate' => 21,
                        'subtotal' => round($service->billed_price / 1.21, 2),
                        'tax_amount' => round($service->billed_price - ($service->billed_price / 1.21), 2),
                        'total' => $service->billed_price,
                        'amount_paid' => 0,
                        'amount_due' => $service->billed_price,
                        'issue_date' => now()->toDateString(),
                        'due_date' => now()->addDays(30)->toDateString(),
                        'view_token' => Str::random(64),
                    ]);

                    $invoice->items()->create([
                        'description' => "{$service->name} - renouvellement ({$service->type})",
                        'quantity' => 1,
                        'unit' => 'month',
                        'unit_price' => round($service->billed_price / 1.21, 2),
                        'total' => round($service->billed_price / 1.21, 2),
                        'sort_order' => 0,
                    ]);

                    // Record the renewal with invoice reference
                    ServiceRenewal::create([
                        'recurring_service_id' => $service->id,
                        'renewal_date' => now()->toDateString(),
                        'new_expiry_date' => $newExpiry->toDateString(),
                        'cost' => $service->real_cost,
                        'billed_amount' => $service->billed_price,
                        'invoice_id' => $invoice->id,
                        'status' => 'completed',
                    ]);

                    // Timeline event on the project
                    $service->projet?->timelineEvents()->create([
                        'user_id' => null,
                        'event_type' => 'invoice_auto_generated',
                        'title' => "Facture auto-générée pour renouvellement de service",
                        'description' => "{$service->name} renouvelé - Facture {$invoice->invoice_number} créée ({$invoice->total} EUR)",
                    ]);

                    // Notify client
                    if ($invoice->client_id) {
                        $client = User::find($invoice->client_id);
                        if ($client) {
                            NotificationService::send($client, 'invoice-sent', [
                                'client_name' => $client->name,
                                'invoice_number' => $invoice->invoice_number,
                                'total' => number_format($invoice->total, 2, ',', '.') . ' EUR',
                                'due_date' => $invoice->due_date->format('d/m/Y'),
                            ], transactional: true, actionUrl: "/client/invoices/{$invoice->id}");
                        }
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to auto-generate invoice for service renewal {$service->id}: {$e->getMessage()}");
                }
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
                "Service expiré : {$service->name}",
                "{$service->name} ({$service->provider}) a expiré et n'est PAS en renouvellement automatique. Action requise.",
                "/admin/services/{$service->id}"
            );

            // Notify client that their service expired
            if ($service->client_id) {
                NotificationService::notify($service->client_id, [
                    'type' => 'service_expired',
                    'title' => "Service expiré : {$service->name}",
                    'message' => "Votre service {$service->name} a expiré. Contactez-nous pour le renouveler et éviter la suspension.",
                ]);
            }
        }

        // Suspend services expired for more than 14 days
        $toSuspend = RecurringService::where('status', 'expired')
            ->where('expiry_date', '<', now()->subDays(14)->toDateString())
            ->get();

        foreach ($toSuspend as $service) {
            $service->update(['status' => 'suspended']);

            // Put project on hold
            if ($service->projet_id) {
                $project = Projet::find($service->projet_id);
                if ($project && !in_array($project->status, ['on_hold', 'cancelled'])) {
                    $project->update(['status' => 'on_hold']);
                    $project->timelineEvents()->create([
                        'user_id' => null,
                        'event_type' => 'status_change',
                        'title' => 'Projet mis en pause - service expiré',
                        'description' => "Le service {$service->name} est suspendu depuis plus de 14 jours. Le projet est mis en pause en attendant le renouvellement.",
                    ]);
                }
            }

            self::notifyAdmins(
                'service_suspended',
                "Service suspendu : {$service->name}",
                "{$service->name} est suspendu (expiré depuis plus de 14 jours). Le projet associé a été mis en pause.",
                "/admin/services/{$service->id}"
            );

            if ($service->client_id) {
                NotificationService::notify($service->client_id, [
                    'type' => 'service_suspended',
                    'title' => "Service suspendu : {$service->name}",
                    'message' => "Votre service {$service->name} a été suspendu car le renouvellement n'a pas été effectué. Contactez-nous pour réactiver.",
                ]);
            }
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
     * Runs daily - each notification is sent only once (dedup by type+service+days).
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
                    "{$service->name}{$context} - {$service->provider} - expires {$service->expiry_date->format('d/m/Y')}" .
                    ($service->auto_renew ? ' (auto-renew ON)' : ' - ACTION REQUIRED'),
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

    // ─── INVOICE OVERDUE REMINDERS (Schedulable) ──────────────────────
    /**
     * Send tiered reminders for overdue invoices (7d, 14d, 30d).
     * Each reminder is sent only once per invoice per tier.
     */
    public static function sendInvoiceReminders(): int
    {
        $count = 0;
        $tiers = [
            ['days' => 7, 'type' => 'overdue_7d', 'label' => '7 jours'],
            ['days' => 14, 'type' => 'overdue_14d', 'label' => '14 jours'],
            ['days' => 30, 'type' => 'overdue_30d', 'label' => '30 jours'],
        ];

        $invoices = Invoice::whereIn('status', ['sent', 'viewed', 'partially_paid', 'overdue'])
            ->where('due_date', '<', now()->toDateString())
            ->where('amount_due', '>', 0)
            ->with('client')
            ->get();

        foreach ($invoices as $invoice) {
            $daysOverdue = (int) now()->startOfDay()->diffInDays($invoice->due_date, false) * -1;

            foreach ($tiers as $tier) {
                if ($daysOverdue < $tier['days']) continue;

                // Check if this reminder was already sent
                $alreadySent = InvoiceReminder::where('invoice_id', $invoice->id)
                    ->where('reminder_type', $tier['type'])
                    ->exists();

                if ($alreadySent) continue;

                // Record the reminder
                InvoiceReminder::create([
                    'invoice_id' => $invoice->id,
                    'reminder_type' => $tier['type'],
                    'sent_at' => now(),
                ]);

                // Notify admins
                self::notifyAdmins(
                    "invoice_overdue_{$tier['type']}",
                    "Facture en retard ({$tier['label']}) : {$invoice->invoice_number}",
                    "La facture {$invoice->invoice_number} de {$invoice->client_name} est en retard de {$daysOverdue} jours. Montant dû : " . number_format($invoice->amount_due, 2) . " EUR",
                    "/admin/invoices/{$invoice->id}"
                );

                // Notify client (if exists)
                if ($invoice->client_id) {
                    $client = User::find($invoice->client_id);
                    if ($client) {
                        NotificationLog::create([
                            'user_id' => $client->id,
                            'type' => "invoice_overdue_{$tier['type']}",
                            'title' => "Rappel : facture {$invoice->invoice_number} en attente",
                            'message' => "Votre facture {$invoice->invoice_number} d'un montant de " . number_format($invoice->amount_due, 2) . " EUR est en attente depuis {$daysOverdue} jours.",
                            'action_url' => "/client/invoices/{$invoice->id}",
                            'is_read' => false,
                        ]);
                    }
                }

                // Log on invoice timeline
                $invoice->timelineEvents()->create([
                    'user_id' => null,
                    'event_type' => 'reminder_sent',
                    'title' => "Rappel envoyé ({$tier['label']})",
                    'description' => "Rappel automatique pour retard de {$daysOverdue} jours",
                ]);

                $count++;
                break; // Only send the highest applicable tier per invoice
            }
        }

        return $count;
    }

    // ─── INVOICE DUE DATE REMINDERS (J-7, J-3, J-1) (Schedulable) ──
    /**
     * Send reminders for invoices approaching their due date.
     * Runs daily - sends at J-7, J-3, J-1 before the due date.
     * Each reminder is sent only once per invoice per tier (dedup via InvoiceReminder).
     */
    public static function sendInvoiceDueReminders(): array
    {
        $reminders = [];
        $reminderDays = [7, 3, 1];

        foreach ($reminderDays as $days) {
            $targetDate = now()->addDays($days)->toDateString();

            $invoices = Invoice::where('due_date', $targetDate)
                ->whereNotIn('status', ['paid', 'cancelled', 'overdue'])
                ->where('amount_due', '>', 0)
                ->with('client')
                ->get();

            foreach ($invoices as $invoice) {
                if (!$invoice->client_id) continue;
                $client = User::find($invoice->client_id);
                if (!$client) continue;

                // Dedup: check if we already sent a reminder for this invoice + day combo
                $reminderType = "due_reminder_j{$days}";
                $alreadySent = InvoiceReminder::where('invoice_id', $invoice->id)
                    ->where('reminder_type', $reminderType)
                    ->exists();

                if ($alreadySent) continue;

                // Record the reminder
                InvoiceReminder::create([
                    'invoice_id' => $invoice->id,
                    'reminder_type' => $reminderType,
                    'sent_at' => now(),
                ]);

                // Send notification via template
                NotificationService::send($client, 'invoice-due-reminder', [
                    'client_name' => $client->name,
                    'invoice_number' => $invoice->invoice_number,
                    'amount_due' => number_format($invoice->amount_due, 2, ',', '.') . ' EUR',
                    'due_date' => $invoice->due_date->format('d/m/Y'),
                    'days_remaining' => $days,
                ], transactional: true, actionUrl: "/client/invoices/{$invoice->id}");

                // Log on invoice timeline
                $invoice->timelineEvents()->create([
                    'user_id' => null,
                    'event_type' => 'reminder_sent',
                    'title' => "Rappel d'échéance envoyé (J-{$days})",
                    'description' => "Rappel automatique : facture {$invoice->invoice_number} arrive à échéance dans {$days} jour(s)",
                ]);

                $reminders[] = "{$invoice->invoice_number} → {$client->email} (J-{$days})";
            }
        }

        return $reminders;
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
        $admins = User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
            ->where('role', 'admin')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            NotificationLog::create([
                'user_id' => $admin->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'action_url' => $actionUrl,
                'is_read' => false,
            ]);

            // Also send email if admin has email notifications enabled
            $prefs = $admin->preferences ?? [];
            $emailEnabled = $prefs['notifications']['notify_admin_emails'] ?? true;
            if ($emailEnabled) {
                self::notifyAdminByEmail($admin, $type, $title, $message, $actionUrl);
            }
        }
    }

    // ─── HELPER: Send email notification to admin ────────────────────
    /**
     * Send email notification to admin via TemplateMail.
     *
     * Triggers that call notifyAdmins() and benefit from email:
     * - Client accepts/rejects a quote (onQuoteAccepted/Rejected)
     * - Service renewed/expired (autoRenewServices)
     * - Invoice overdue reminder (sendInvoiceReminders)
     * - Service expiry notifications (sendServiceExpiryNotifications)
     */
    private static function notifyAdminByEmail(User $admin, string $type, string $title, string $message, ?string $actionUrl = null): void
    {
        try {
            \Illuminate\Support\Facades\Mail::to($admin->email)->send(
                new \App\Mail\TemplateMail(
                    "[NA Admin] {$title}",
                    "<p>{$message}</p>" . ($actionUrl ? "<p><a href='" . url($actionUrl) . "'>Voir les détails</a></p>" : '')
                )
            );
            Log::info("Admin email notification sent to {$admin->email}: [{$type}] {$title}");
        } catch (\Exception $e) {
            Log::warning("Failed to send admin email notification: {$e->getMessage()}");
        }
    }

    // ─── PUBLIC: Send email notification to partner (callable from other services) ──
    public static function notifyPartnerByEmailPublic(User $partner, string $type, array $data): void
    {
        self::notifyPartnerByEmail($partner, $type, $data);
    }

    // ─── HELPER: Send email notification to partner ─────────────────────
    /**
     * Send email notification to a referral partner via TemplateMail.
     * Respects partner email notification preferences.
     *
     * Triggers:
     * - Lead converted (won) -> partner earns commission
     * - Commission paid -> partner receives payment
     */
    private static function notifyPartnerByEmail(User $partner, string $type, array $data): void
    {
        try {
            $prefs = $partner->preferences ?? [];
            $emailEnabled = $prefs['notifications']['notify_partner_emails'] ?? true;
            if (!$emailEnabled) return;

            $messages = [
                'lead-won-partner' => "Bonne nouvelle ! Votre référence {$data['client_name']} a été convertie pour le projet \"{$data['project_name']}\". Votre taux de commission : {$data['commission_rate']}%.",
                'commission-paid' => "Votre commission de {$data['commission_amount']} EUR a été payée. Référence : {$data['payment_reference']}.",
                'commission-earned' => "Vous avez gagné une commission de {$data['commission_amount']} EUR suite au paiement de la facture {$data['invoice_number']}.",
            ];

            $message = $messages[$type] ?? "Notification partenaire : {$type}";

            \Illuminate\Support\Facades\Mail::to($partner->email)->send(
                new \App\Mail\TemplateMail(
                    "[NA Innovations] Notification partenaire",
                    "<p>{$message}</p>"
                )
            );
            Log::info("Partner email notification sent to {$partner->email}: [{$type}] {$message}");
        } catch (\Exception $e) {
            Log::warning("Failed to send partner email notification: {$e->getMessage()}");
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

        $projet = Projet::create([
            'nom_societe' => $quote->client_company ?: $quote->client_name,
            'type_site' => $quote->title,
            'client_id' => $client?->id,
            'lead_id' => $lead?->id,
            'status' => 'planning',
            'budget' => $quote->total,
            'description' => $quote->scope_of_work,
        ]);

        // Link admin(s) so the project appears in their tenant scope.
        // Prefer the currently authenticated admin (HTTP context), otherwise
        // attach all admins (background/job context) to preserve visibility.
        $authId = auth()->id();
        if ($authId) {
            $projet->admins()->syncWithoutDetaching([
                $authId => ['role' => 'owner'],
            ]);
        } else {
            $adminIds = User::where('role', 'admin')->pluck('id');
            if ($adminIds->isNotEmpty()) {
                $sync = $adminIds->mapWithKeys(fn ($id) => [$id => ['role' => 'owner']])->all();
                $projet->admins()->syncWithoutDetaching($sync);
            }
        }

        return $projet;
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
