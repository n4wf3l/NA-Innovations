<?php

namespace App\Http\Controllers\Partner;

use App\Models\EmailTemplate;
use App\Models\Lead;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $leads = Lead::where('referral_partner_id', $partner->id)
            ->latest()
            ->paginate(15);

        return Inertia::render('Partner/Leads/Index', [
            'leads' => $leads,
            'commissionRate' => $partner->default_commission_rate,
        ]);
    }

    public function show(Lead $lead)
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner || $lead->referral_partner_id !== $partner->id) abort(403);

        $lead->load([
            'timelineEvents' => fn($q) => $q->latest(),
            'quotes' => fn($q) => $q->select('id', 'lead_id', 'quote_number', 'title', 'total', 'status'),
            'commissions' => fn($q) => $q->where('referral_partner_id', $partner->id),
            'notes' => fn($q) => $q->where('is_private', false)->latest(),
        ]);

        // If lead is won, find the associated project
        $project = null;
        if ($lead->status === 'won' && $lead->converted_client_id) {
            $project = \App\Models\Projet::where('lead_id', $lead->id)
                ->orWhere('client_id', $lead->converted_client_id)
                ->with('developer')
                ->first();
        }

        return Inertia::render('Partner/Leads/Show', [
            'lead' => $lead,
            'project' => $project,
            'commissionRate' => $partner->default_commission_rate,
        ]);
    }

    public function create()
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $template = EmailTemplate::where('slug', 'partner-lead-outreach')->first();

        return Inertia::render('Partner/Leads/Submit', [
            'emailTemplate' => $template ? [
                'subject' => $template->subject,
                'body' => $template->body,
            ] : [
                'subject' => 'NA Innovations - We would love to help you with your project',
                'body' => "Dear {{ client_name }},\n\nWe would love to learn more about your project needs.\n\nBest regards,\nNA Innovations",
            ],
            'partnerName' => $partner->user->name,
            'projectTypes' => \App\Enums\ProjectType::allWithRates(),
        ]);
    }

    public function store(Request $request)
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'service_interest' => 'nullable|string|in:' . implode(',', array_keys(\App\Enums\ProjectType::TYPES)),
            'estimated_budget' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'email_subject' => 'required|string|max:255',
            'email_body' => 'required|string',
            'send_email' => 'nullable|boolean',
        ]);

        $shouldSendEmail = $request->boolean('send_email', true);

        // Create the lead with status "brief_pending" (waiting for client response)
        $partnerAdminId = $partner->user?->admin_id
            ?? \App\Models\User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
                ->where('role', 'admin')->orderBy('id')->value('id');

        $lead = Lead::create([
            'admin_id' => $partnerAdminId,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'company_name' => $validated['company_name'] ?? null,
            'service_interest' => $validated['service_interest'] ?? null,
            'estimated_budget' => $validated['estimated_budget'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'source' => 'referral',
            'status' => 'brief_pending',
            'referral_partner_id' => $partner->id,
            'contacted_at' => now(),
        ]);

        // Generate PDF and store it
        $pdfData = [
            'lead' => $validated,
            'partner_name' => $partner->user->name,
        ];
        $pdf = Pdf::loadView('pdf.lead-submission', $pdfData)->setPaper('a4');
        $pdfPath = "leads/lead-{$lead->id}-submission.pdf";
        Storage::disk('local')->put($pdfPath, $pdf->output());

        // Store the email content in notes for record
        $emailBody = str_replace(
            ['{{ client_name }}', '{{ client_email }}', '{{ partner_name }}', '{{ company_name }}', '{{ service_interest }}', '{{ estimated_budget }}'],
            [
                $validated['first_name'] . ' ' . $validated['last_name'],
                $validated['email'],
                $partner->user->name,
                $validated['company_name'] ?? '',
                $validated['service_interest'] ?? '',
                $validated['estimated_budget'] ?? '',
            ],
            $validated['email_body']
        );

        // Timeline events
        $lead->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'lead_created',
            'title' => 'Lead submitted by partner',
            'description' => "Submitted by {$partner->user->name} ({$partner->referral_code})",
        ]);

        $lead->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'email_prepared',
            'title' => 'Outreach email prepared',
            'description' => "Email to {$validated['email']} prepared with PDF attachment. Subject: {$validated['email_subject']}",
            'metadata' => [
                'email_subject' => $validated['email_subject'],
                'email_body' => $emailBody,
                'pdf_path' => $pdfPath,
                'to' => $validated['email'],
            ],
        ]);

        $lead->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'status_change',
            'title' => 'Status: Brief Pending',
            'description' => 'Waiting for client to respond with project details',
            'old_value' => 'new',
            'new_value' => 'brief_pending',
        ]);

        // Send outreach email to the prospect with PDF attachment (respects template toggle + partner choice)
        if (!$shouldSendEmail) {
            $lead->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'email_skipped',
                'title' => 'Outreach email skipped',
                'description' => "Partner chose not to send the automatic outreach email to {$validated['email']}.",
            ]);
        } else {
        $outreachTemplate = \App\Models\EmailTemplate::where('slug', 'partner-lead-outreach')->where('is_active', true)->first();
        try {
            if (!$outreachTemplate) {
                throw new \Exception('Template partner-lead-outreach is disabled');
            }
            \Illuminate\Support\Facades\Mail::to($validated['email'])->send(
                new \App\Mail\TemplateMail($validated['email_subject'], $emailBody, $pdfPath)
            );

            $lead->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'email_sent',
                'title' => 'Outreach email sent',
                'description' => "Email sent to {$validated['email']} with PDF attachment.",
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Partner lead email failed: {$e->getMessage()}");

            $lead->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'email_failed',
                'title' => 'Outreach email failed',
                'description' => "Failed to send email to {$validated['email']}: {$e->getMessage()}",
            ]);
        }
        }

        // Notify admin that a new lead was submitted
        \App\Services\NotificationService::sendToAdmins('new-lead-admin', [
            'partner_name' => $partner->user->name,
            'lead_name' => "{$validated['first_name']} {$validated['last_name']}",
            'lead_email' => $validated['email'],
            'service' => $validated['service_interest'] ?? 'Non specified',
        ], actionUrl: "/admin/leads/{$lead->id}");

        $successMsg = $shouldSendEmail
            ? "Lead created for {$validated['first_name']} {$validated['last_name']}. The outreach email has been sent."
            : "Lead created for {$validated['first_name']} {$validated['last_name']}. No email was sent - our team will contact them.";

        return redirect()->route('partner.leads.index')
            ->with('success', $successMsg);
    }
}
