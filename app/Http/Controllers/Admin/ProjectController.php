<?php

namespace App\Http\Controllers\Admin;

use App\Models\Lead;
use App\Models\Projet;
use App\Models\User;
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
        ]);

        $projet = Projet::create($validated);

        // Create timeline event for project creation
        $projet->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'project_created',
            'title' => 'Project created',
            'description' => 'Project "' . $projet->nom_societe . '" was created.',
        ]);

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
            'timelineEvents' => function ($query) {
                $query->latest();
            },
            'notes' => function ($query) {
                $query->latest();
            },
            'documents',
        ]);

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
        ]);
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
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Projet $project)
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
        ]);

        $oldStatus = $project->status;
        $newStatus = $validated['status'];

        $project->update($validated);

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
        $project->update(['status' => $request->status]);

        if ($oldStatus !== $request->status) {
            $project->timelineEvents()->create([
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
