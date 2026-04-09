<?php

namespace App\Http\Controllers\Admin;

use App\Models\EmailTemplate;
use App\Models\Lead;
use App\Models\Projet;
use App\Models\User;
use App\Services\WorkflowService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends BaseAdminController
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request)
    {
        $query = Projet::with('client', 'developer');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by client
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Filter by developer
        if ($request->filled('developer_id')) {
            $query->where('developer_id', $request->developer_id);
        }

        // Search by name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nom_societe', 'like', "%{$search}%");
        }

        $projects = $query->latest()->paginate(15)->withQueryString();
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $developers = User::whereIn('role', ['admin', 'developer'])->orderBy('name')->get();

        $kanbanQuery = Projet::with('developer', 'client', 'lead.referralPartner.user');

        if ($request->filled('developer_id')) {
            $kanbanQuery->where('developer_id', $request->developer_id);
        }

        $kanbanProjects = $kanbanQuery
            ->orderBy('updated_at', 'desc')
            ->get()
            ->groupBy('status');

        $totalProjects = \App\Models\Projet::count();
        $activeProjects = \App\Models\Projet::whereIn('status', ['in_progress', 'review'])->count();
        $completedProjects = \App\Models\Projet::where('status', 'completed')->count();
        $totalBudget = \App\Models\Projet::sum('budget');

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'clients' => $clients,
            'developers' => $developers,
            'kanbanProjects' => $kanbanProjects,
            'totalProjects' => $totalProjects,
            'activeProjects' => $activeProjects,
            'completedProjects' => $completedProjects,
            'totalBudget' => $totalBudget,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $developers = User::whereIn('role', ['admin', 'developer'])->orderBy('name')->get();
        $leads = Lead::whereNotNull('referral_partner_id')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Projects/Create', [
            'clients' => $clients,
            'developers' => $developers,
            'leads' => $leads,
            'projectTypes' => \App\Enums\ProjectType::allWithRates(),
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_societe' => 'required|string|max:255',
            'type_societe' => 'nullable|string|max:255',
            'type_site' => 'nullable|string|max:255',
            'lieu' => 'nullable|string|max:255',
            'client_id' => 'nullable|exists:users,id',
            'developer_id' => 'nullable|exists:users,id',
            'lead_id' => 'nullable|exists:leads,id',
            'status' => 'required|in:planning,in_progress,review,completed,on_hold,cancelled',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'deadline' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'github_repo' => 'nullable|string|max:255',
            'show_commits_to_client' => 'nullable|boolean',
        ]);

        // Auto-set github_linked_by when repo is provided
        if (!empty($validated['github_repo'])) {
            $validated['github_linked_by'] = auth()->id();
        }

        $projet = Projet::create($validated);

        // Create timeline event for project creation
        $projet->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'project_created',
            'title' => 'Project created',
            'description' => 'Project "' . $projet->nom_societe . '" was created.',
        ]);

        // Notify developer if assigned at creation
        if (!empty($validated['developer_id'])) {
            $dev = \App\Models\User::find($validated['developer_id']);
            if ($dev) {
                \App\Services\NotificationService::send($dev, 'project-assigned-dev', [
                    'dev_name' => $dev->name,
                    'project_name' => $projet->nom_societe,
                    'client_name' => $projet->client?->name ?? $projet->nom_societe,
                    'deadline' => $projet->deadline ? $projet->deadline->format('d/m/Y') : 'Non définie',
                ], transactional: true, actionUrl: "/dev/projects/{$projet->id}");
            }
        }

        return redirect()->route('admin.projects.index')->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified project.
     */
    public function show(Projet $project)
    {
        $project->load([
            'client',
            'developer',
            'lead.referralPartner.user',
            'quotes',
            'invoices',
            'recurringServices',
            'payouts.user',
            'timelineEvents' => function ($query) {
                $query->latest();
            },
            'notes' => function ($query) {
                $query->latest();
            },
            'documents.uploader',
        ]);

        $locale = $project->client?->locale ?? app()->getLocale();
        $updateTemplate = EmailTemplate::where('slug', 'project-update')->where('locale', $locale)->where('is_active', true)->first();
        $sentEmails = $project->sentEmails()->with('sender')->latest()->get();

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
            'emailTemplate' => $updateTemplate ? [
                'subject' => str_replace('{{ project_name }}', $project->nom_societe, $updateTemplate->subject),
                'body' => str_replace(
                    ['{{ client_name }}', '{{ project_name }}', '{{ project_status }}'],
                    [$project->client?->name ?? '', $project->nom_societe, $project->status ?? ''],
                    $updateTemplate->body
                ),
                'variables' => is_string($updateTemplate->available_variables) ? json_decode($updateTemplate->available_variables, true) : ($updateTemplate->available_variables ?? []),
            ] : null,
            'sentEmails' => $sentEmails,
        ]);
    }

    /**
     * Send an email update to the project client.
     */
    public function sendEmail(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'recipient_email' => 'required|email',
            'subject' => 'required|string|max:500',
            'body' => 'required|string',
        ]);

        $sentEmail = $project->sentEmails()->create([
            'user_id' => auth()->id(),
            'recipient_email' => $validated['recipient_email'],
            'recipient_name' => $project->client?->name ?? $validated['recipient_email'],
            'subject' => $validated['subject'],
            'body' => $validated['body'],
            'template_slug' => 'project-update',
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        $project->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'email_sent',
            'title' => 'Email sent to client',
            'description' => "Subject: {$validated['subject']}",
        ]);

        // Send the email (check project-update template is active)
        $updateTemplate = \App\Models\EmailTemplate::where('slug', 'project-update')->where('is_active', true)->first();
        if (!$updateTemplate) {
            $sentEmail->update(['status' => 'failed', 'error_message' => 'Email template "project-update" is disabled.']);
            return redirect()->back()->with('error', 'Email template is disabled. Enable it in Settings to send emails.');
        }
        try {
            \Illuminate\Support\Facades\Mail::to($validated['recipient_email'])->send(
                new \App\Mail\TemplateMail($validated['subject'], $validated['body'])
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to send project email: {$e->getMessage()}");
            $sentEmail->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Email logged but sending failed. Check mail configuration.');
        }

        return redirect()->back()->with('success', 'Email sent successfully.');
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Projet $project)
    {
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $developers = User::whereIn('role', ['admin', 'developer'])->orderBy('name')->get();
        $leads = Lead::whereNotNull('referral_partner_id')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
            'clients' => $clients,
            'developers' => $developers,
            'leads' => $leads,
            'projectTypes' => \App\Enums\ProjectType::allWithRates(),
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Projet $project)
    {
        // Convert empty strings to null (FormData sends "" for empty fields)
        $request->merge(collect($request->except(['image', '_method']))->map(fn($v) => $v === '' ? null : $v)->all());

        $validated = $request->validate([
            'nom_societe' => 'required|string|max:255',
            'type_societe' => 'nullable|string|max:255',
            'type_site' => 'nullable|string|max:255',
            'lieu' => 'nullable|string|max:255',
            'client_id' => 'nullable|exists:users,id',
            'developer_id' => 'nullable|exists:users,id',
            'lead_id' => 'nullable|exists:leads,id',
            'status' => 'required|in:planning,in_progress,review,completed,on_hold,cancelled',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'deadline' => 'nullable|date',
            'budget' => 'nullable|numeric|min:0',
            'github_repo' => 'nullable|string|max:255',
            'show_commits_to_client' => 'nullable',
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
            'preview_url' => 'nullable|string|max:500',
            'staging_url' => 'nullable|string|max:500',
            'useful_links' => 'nullable',
            'client_action_required' => 'nullable',
            'client_action_message' => 'nullable|string|max:2000',
            'current_phase' => 'nullable|string|max:255',
            'next_milestone_label' => 'nullable|string|max:255',
            'next_milestone_date' => 'nullable|date',
        ]);

        // Normalize boolean from FormData string
        $validated['show_commits_to_client'] = filter_var($validated['show_commits_to_client'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $validated['client_action_required'] = filter_var($validated['client_action_required'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Decode useful_links JSON string sent via FormData
        if (isset($validated['useful_links']) && is_string($validated['useful_links'])) {
            $decoded = json_decode($validated['useful_links'], true);
            $validated['useful_links'] = is_array($decoded) ? $decoded : null;
        }

        // Handle project logo upload
        if ($request->hasFile('image')) {
            if ($project->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($project->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($project->image);
            }
            $validated['image'] = $request->file('image')->store('projects', 'public');
        } else {
            unset($validated['image']);
        }

        // Auto-set github_linked_by when repo changes
        if (!empty($validated['github_repo']) && $validated['github_repo'] !== $project->github_repo) {
            $validated['github_linked_by'] = auth()->id();
        }
        if (empty($validated['github_repo'])) {
            $validated['github_linked_by'] = null;
        }

        $oldStatus = $project->status;
        $oldDevId = $project->developer_id;
        $newStatus = $validated['status'];

        $project->update($validated);

        // Notify developer when assigned
        if (($validated['developer_id'] ?? null) && $validated['developer_id'] != $oldDevId) {
            $dev = \App\Models\User::find($validated['developer_id']);
            if ($dev) {
                \App\Services\NotificationService::send($dev, 'project-assigned-dev', [
                    'dev_name' => $dev->name,
                    'project_name' => $project->nom_societe,
                    'client_name' => $project->client?->name ?? $project->nom_societe,
                    'deadline' => $project->deadline ? $project->deadline->format('d/m/Y') : 'Non définie',
                ], transactional: true, actionUrl: "/dev/projects/{$project->id}");

                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'developer_assigned',
                    'title' => 'Developer assigned',
                    'description' => "{$dev->name} has been assigned to this project.",
                ]);
            }
        }

        // Track status change
        if ($oldStatus !== $newStatus) {
            $project->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'status_change',
                'title' => 'Status changed',
                'description' => "Status changed from " . ucwords(str_replace('_', ' ', $oldStatus)) . " to " . ucwords(str_replace('_', ' ', $newStatus)),
                'old_value' => $oldStatus,
                'new_value' => $newStatus,
            ]);

            // Trigger workflow on completion
            if ($newStatus === 'completed') {
                $actions = WorkflowService::onProjectCompleted($project);
                if (in_array('final_invoice_suggested', $actions)) {
                    return redirect()->route('admin.projects.show', $project)
                        ->with('success', 'Project completed. A final invoice should be created for the remaining balance.');
                }
            }
        }

        return redirect()->route('admin.projects.show', $project)->with('success', 'Project updated successfully.');
    }

    /**
     * Soft delete the specified project.
     */
    public function destroy(Projet $project)
    {
        $project->delete();

        return redirect()->route('admin.projects.index')->with('success', 'Project deleted successfully.');
    }

    /**
     * Update project status via AJAX (Kanban drag-and-drop).
     */
    public function updateStatus(Request $request, Projet $project)
    {
        $request->validate(['status' => 'required|in:planning,in_progress,review,completed,on_hold,cancelled']);

        $oldStatus = $project->status;
        $newStatus = $request->status;
        $project->update(['status' => $newStatus]);

        if ($oldStatus !== $newStatus) {
            $project->timelineEvents()->create([
                'user_id' => auth()->id(),
                'event_type' => 'status_change',
                'title' => 'Status changed',
                'description' => "Status changed from {$oldStatus} to {$newStatus}",
                'old_value' => $oldStatus,
                'new_value' => $newStatus,
            ]);

            if ($newStatus === 'completed') {
                WorkflowService::onProjectCompleted($project);
            }
        }

        return response()->json(['success' => true]);
    }

    /**
     * Update GitHub repo settings inline from the Show page.
     */
    public function updateGithub(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'github_repo' => 'nullable|string|max:255',
            'show_commits_to_client' => 'nullable|boolean',
        ]);

        if (!empty($validated['github_repo']) && $validated['github_repo'] !== $project->github_repo) {
            $validated['github_linked_by'] = auth()->id();
        }
        if (empty($validated['github_repo'])) {
            $validated['github_repo'] = null;
            $validated['github_linked_by'] = null;
            $validated['show_commits_to_client'] = false;
        }

        $project->update($validated);

        return redirect()->back()->with('success', 'GitHub settings updated.');
    }

    // ─── PAYOUTS ─────────────────────────────────────────────

    public function storePayout(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:developer,admin,subcontractor,freelancer',
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,paid',
            'paid_date' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'payment_reference' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['project_id'] = $project->id;
        if ($validated['status'] === 'paid' && !$validated['paid_date']) {
            $validated['paid_date'] = now()->toDateString();
        }

        \App\Models\ProjectPayout::create($validated);

        return redirect()->back()->with('success', 'Paiement ajouté.');
    }

    public function updatePayout(Request $request, \App\Models\ProjectPayout $payout)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid',
            'paid_date' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        if ($validated['status'] === 'paid' && !$validated['paid_date']) {
            $validated['paid_date'] = now()->toDateString();
        }

        $payout->update($validated);

        return redirect()->back()->with('success', 'Paiement mis à jour.');
    }

    public function destroyPayout(\App\Models\ProjectPayout $payout)
    {
        $payout->delete();

        return redirect()->back()->with('success', 'Paiement supprimé.');
    }
}
