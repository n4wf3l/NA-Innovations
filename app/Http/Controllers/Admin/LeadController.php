<?php

namespace App\Http\Controllers\Admin;

use App\Models\Lead;
use App\Models\ReferralPartner;
use App\Services\WorkflowService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends BaseAdminController
{
    /**
     * Display a listing of leads with filters.
     */
    public function index(Request $request)
    {
        $query = Lead::with('referralPartner.user');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by source
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $leads = $query->latest()->paginate(15)->withQueryString();

        $kanbanLeads = Lead::with('referralPartner.user')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->groupBy('status');

        return Inertia::render('Admin/Leads/Index', [
            'leads' => $leads,
            'kanbanLeads' => $kanbanLeads,
        ]);
    }

    /**
     * Show the form for creating a new lead.
     */
    public function create()
    {
        $partners = ReferralPartner::with('user')->where('is_active', true)->get();

        return Inertia::render('Admin/Leads/Create', [
            'partners' => $partners,
            'projectTypes' => \App\Enums\ProjectType::allWithRates(),
        ]);
    }

    /**
     * Store a newly created lead.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,brief_pending,brief_completed,call_scheduled,qualified,not_qualified,quote_draft,quote_sent,won,lost',
            'source' => 'required|in:referral,organic,website_contact,social_media,word_of_mouth,advertising,other',
            'referral_partner_id' => 'nullable|exists:referral_partners,id',
            'service_interest' => 'nullable|string|in:' . implode(',', array_keys(\App\Enums\ProjectType::TYPES)),
            'estimated_budget' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        Lead::create($validated);

        return redirect()->route('admin.leads.index')->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified lead.
     */
    public function show(Lead $lead)
    {
        $lead->load([
            'referralPartner.user',
            'briefs',
            'quotes',
            'timelineEvents' => function ($query) {
                $query->latest();
            },
            'notes' => function ($query) {
                $query->with('user')->latest();
            },
        ]);

        return Inertia::render('Admin/Leads/Show', [
            'lead' => $lead,
        ]);
    }

    /**
     * Show the form for editing the specified lead.
     */
    public function edit(Lead $lead)
    {
        $partners = ReferralPartner::with('user')->where('is_active', true)->get();

        return Inertia::render('Admin/Leads/Edit', [
            'lead' => $lead,
            'partners' => $partners,
            'projectTypes' => \App\Enums\ProjectType::allWithRates(),
        ]);
    }

    /**
     * Update the specified lead.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'status' => 'required|in:new,contacted,brief_pending,brief_completed,call_scheduled,qualified,not_qualified,quote_draft,quote_sent,won,lost',
            'source' => 'required|in:referral,organic,website_contact,social_media,word_of_mouth,advertising,other',
            'referral_partner_id' => 'nullable|exists:referral_partners,id',
            'service_interest' => 'nullable|string|in:' . implode(',', array_keys(\App\Enums\ProjectType::TYPES)),
            'estimated_budget' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $lead->status;
        $newStatus = $validated['status'];

        $lead->update($validated);

        // Track status change + auto-set timestamps
        if ($oldStatus !== $newStatus) {
            WorkflowService::onLeadStatusChanged($lead, $oldStatus, $newStatus);

            $lead->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'status_change',
                'title' => 'Status changed',
                'description' => "Status changed from {$oldStatus} to {$newStatus}",
                'old_value' => $oldStatus,
                'new_value' => $newStatus,
            ]);
        }

        return redirect()->back()->with('success', 'Lead updated successfully.');
    }

    /**
     * Soft delete the specified lead.
     */
    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('admin.leads.index')->with('success', 'Lead deleted successfully.');
    }

    /**
     * Bulk update status for multiple leads.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:leads,id',
            'status' => 'required|in:new,contacted,brief_pending,brief_completed,call_scheduled,qualified,not_qualified,quote_draft,quote_sent,won,lost',
        ]);

        Lead::whereIn('id', $request->ids)->update(['status' => $request->status]);

        return redirect()->back()->with('success', count($request->ids) . ' lead(s) mis à jour.');
    }

    /**
     * Bulk delete multiple leads.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:leads,id',
        ]);

        Lead::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', count($request->ids) . ' lead(s) supprimé(s).');
    }

    /**
     * Update lead status via AJAX (Kanban drag-and-drop).
     */
    public function updateStatus(Request $request, Lead $lead)
    {
        $request->validate(['status' => 'required|in:new,contacted,brief_pending,brief_completed,call_scheduled,qualified,not_qualified,quote_draft,quote_sent,won,lost']);

        $oldStatus = $lead->status;
        $lead->update(['status' => $request->status]);

        if ($oldStatus !== $request->status) {
            WorkflowService::onLeadStatusChanged($lead, $oldStatus, $request->status);

            $lead->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'status_change',
                'title' => 'Status changed',
                'description' => "Status changed from {$oldStatus} to {$request->status}",
                'old_value' => $oldStatus,
                'new_value' => $request->status,
            ]);
        }

        return response()->json(['success' => true]);
    }
}
