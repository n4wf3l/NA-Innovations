<?php
namespace App\Http\Controllers\Dev;

use App\Models\DevMessage;
use App\Models\Note;
use App\Models\ProjectDoc;
use App\Models\ProjectMilestone;
use App\Models\Projet;
use App\Models\NotificationLog;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $tab = $request->get('tab', 'pending');

        $pendingProjects = Projet::whereNull('developer_id')
            ->where('status', 'planning')
            ->with('client', 'lead.referralPartner.user')
            ->latest()
            ->get();

        $myProjects = Projet::where('developer_id', $user->id)
            ->with('client')
            ->latest()
            ->get();

        return Inertia::render('Dev/Projects/Index', [
            'pendingProjects' => $pendingProjects,
            'myProjects' => $myProjects,
            'tab' => $tab,
        ]);
    }

    public function show(Projet $project)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $project->load('client', 'developer', 'lead.referralPartner.user', 'timelineEvents', 'quotes', 'invoices', 'timeEntries.user', 'notes.user', 'briefs', 'projectDocs.author', 'milestones', 'devMessages.sender', 'deliverables.completer:id,name');

        // Settings
        $settings = [
            'showMilestones' => Setting::get('dev.show_milestones', '1') === '1',
            'showCredentials' => Setting::get('dev.show_credentials', '1') === '1',
            'showMessaging' => Setting::get('dev.show_messaging', '1') === '1',
            'allowBlockedStatus' => Setting::get('dev.allow_blocked_status', '1') === '1',
            'showUsefulLinks' => Setting::get('dev.show_useful_links', '1') === '1',
            'decloisonedNotes' => Setting::get('dev.decloisoned_notes', '1') === '1',
            'allowRelease' => Setting::get('dev.allow_release', '1') === '1',
        ];

        // Filter time entries for this dev
        $myTimeEntries = $project->timeEntries
            ->where('user_id', $user->id)
            ->sortByDesc('date')
            ->values();

        $totalHours = $myTimeEntries->sum('hours');

        // Notes — decloisoned or own only
        $notesCollection = $settings['decloisonedNotes']
            ? $project->notes
            : $project->notes->where('user_id', $user->id);
        $myNotes = $notesCollection->sortByDesc('created_at')->values();

        $projectDocs = $project->projectDocs
            ->sortBy('sort_order')
            ->sortBy('title')
            ->values();

        return Inertia::render('Dev/Projects/Show', [
            'project' => $project,
            'myTimeEntries' => $myTimeEntries,
            'totalHours' => round($totalHours, 2),
            'myNotes' => $myNotes,
            'authUserId' => $user->id,
            'projectDocs' => $projectDocs,
            'milestones' => $project->milestones,
            'devMessages' => $project->devMessages,
            'devSettings' => $settings,
        ]);
    }

    public function release(Projet $project)
    {
        if (Setting::get('dev.allow_release', '1') !== '1') abort(403);
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);

        $project->update([
            'developer_id' => null,
            'status' => 'planning',
        ]);

        $project->timelineEvents()->create([
            'user_id' => $user->id,
            'event_type' => 'developer_released',
            'title' => 'Project released',
            'description' => "{$user->name} released this project",
        ]);

        return redirect()->route('dev.projects.index')->with('success', __('Projet libéré.'));
    }

    public function storeMilestone(Request $request, Projet $project)
    {
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,done,blocked',
        ]);
        $validated['project_id'] = $project->id;
        $validated['sort_order'] = $project->milestones()->count();
        ProjectMilestone::create($validated);
        return redirect()->back()->with('success', __('Étape ajoutée.'));
    }

    public function updateMilestone(Request $request, ProjectMilestone $milestone)
    {
        $user = auth()->user();
        if ($milestone->project->developer_id !== $user->id) abort(403);
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:pending,in_progress,done,blocked',
        ]);
        $milestone->update($validated);
        return redirect()->back()->with('success', __('Étape mise à jour.'));
    }

    public function reorderMilestones(Request $request, Projet $project)
    {
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:project_milestones,id',
        ]);
        foreach ($validated['ids'] as $index => $id) {
            ProjectMilestone::where('id', $id)
                ->where('project_id', $project->id)
                ->update(['sort_order' => $index]);
        }
        return redirect()->back()->with('success', __('Ordre des étapes mis à jour.'));
    }

    public function deleteMilestone(ProjectMilestone $milestone)
    {
        $user = auth()->user();
        if ($milestone->project->developer_id !== $user->id) abort(403);
        $milestone->delete();
        return redirect()->back()->with('success', __('Étape supprimée.'));
    }

    public function storeMessage(Request $request, Projet $project)
    {
        if (Setting::get('dev.show_messaging', '1') !== '1') abort(403);
        $user = auth()->user();
        if ($project->developer_id !== $user->id && $user->role !== 'admin') abort(403);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'recipient_role' => 'required|in:admin,client,dev',
        ]);

        DevMessage::create([
            'project_id' => $project->id,
            'sender_id' => $user->id,
            'recipient_role' => $validated['recipient_role'],
            'content' => $validated['content'],
        ]);

        return redirect()->back()->with('success', __('Message envoyé.'));
    }

    public function updateBlockedStatus(Request $request, Projet $project)
    {
        if (Setting::get('dev.allow_blocked_status', '1') !== '1') abort(403);
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);

        $validated = $request->validate([
            'status' => 'required|in:blocked,waiting_client,on_hold,in_progress',
        ]);

        $oldStatus = $project->status;
        $project->update(['status' => $validated['status']]);

        $project->timelineEvents()->create([
            'user_id' => $user->id,
            'event_type' => 'status_change',
            'title' => 'Status updated',
            'old_value' => $oldStatus,
            'new_value' => $validated['status'],
        ]);

        return redirect()->back()->with('success', __('Statut mis à jour.'));
    }

    public function updateCredentials(Request $request, Projet $project)
    {
        if (Setting::get('dev.show_credentials', '1') !== '1') abort(403);
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);
        $validated = $request->validate([
            'project_credentials' => 'nullable|string|max:10000',
            'project_env' => 'nullable|string|max:20000',
        ]);
        $project->update($validated);
        return redirect()->back()->with('success', __('Identifiants mis à jour.'));
    }

    public function claim(Projet $project)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        if ($project->developer_id) {
            return redirect()->back()->with('error', 'This project is already assigned to someone.');
        }

        // Assign developer
        $project->update([
            'developer_id' => $user->id,
            'status' => 'in_progress',
            'start_date' => now()->toDateString(),
        ]);

        // Timeline event
        $project->timelineEvents()->create([
            'user_id' => $user->id,
            'event_type' => 'developer_assigned',
            'title' => 'Developer assigned',
            'description' => "{$user->name} claimed this project",
            'new_value' => $user->name,
        ]);

        $project->timelineEvents()->create([
            'user_id' => $user->id,
            'event_type' => 'status_change',
            'title' => 'Status: In Progress',
            'description' => 'Project moved to In Progress',
            'old_value' => 'planning',
            'new_value' => 'in_progress',
        ]);

        // Notify the referral partner if this project came from a lead
        if ($project->lead_id) {
            $lead = $project->lead;
            if ($lead && $lead->referral_partner_id) {
                $partner = $lead->referralPartner;
                if ($partner) {
                    NotificationLog::create([
                        'user_id' => $partner->user_id,
                        'type' => 'project_claimed',
                        'title' => 'Your referral project has been claimed!',
                        'message' => "Great news! A developer ({$user->name}) has been assigned to the project \"{$project->nom_societe}\". Development will start soon.",
                        'action_url' => "/partner/leads/{$lead->id}",
                        'data' => [
                            'project_id' => $project->id,
                            'developer_name' => $user->name,
                            'lead_id' => $lead->id,
                        ],
                        'channel' => 'database',
                    ]);
                }
            }
        }

        return redirect()->route('dev.projects.index')
            ->with('success', "You've claimed \"{$project->nom_societe}\"! It's now In Progress.");
    }

    public function updateStatus(Request $request, Projet $project)
    {
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);

        $allowed = [
            'planning' => ['in_progress'],
            'in_progress' => ['review'],
            'review' => ['in_progress'],
        ];

        $request->validate(['status' => 'required|string']);
        $newStatus = $request->status;
        $oldStatus = $project->status;

        if (!isset($allowed[$oldStatus]) || !in_array($newStatus, $allowed[$oldStatus])) {
            return redirect()->back()->with('error', 'This status transition is not allowed.');
        }

        $project->update(['status' => $newStatus]);
        $project->timelineEvents()->create([
            'user_id' => $user->id,
            'event_type' => 'status_change',
            'title' => 'Status updated by developer',
            'description' => ucwords(str_replace('_', ' ', $oldStatus)) . ' → ' . ucwords(str_replace('_', ' ', $newStatus)),
            'old_value' => $oldStatus,
            'new_value' => $newStatus,
        ]);

        // Notify admin
        \App\Services\NotificationService::sendToAdmins('project-status-update', [
            'project_name' => $project->nom_societe,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ], actionUrl: "/admin/projects/{$project->id}");

        return redirect()->back()->with('success', 'Status updated.');
    }

    public function storeNote(Request $request, Projet $project)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $project->notes()->create([
            'user_id' => $user->id,
            'content' => $validated['content'],
            'is_private' => true,
            'is_pinned' => false,
        ]);

        return redirect()->back()->with('success', 'Note added.');
    }

    public function destroyNote(Note $note)
    {
        $user = auth()->user();
        if ($note->user_id !== $user->id) abort(403);

        $note->delete();

        return redirect()->back()->with('success', 'Note deleted.');
    }

    public function storeDocs(Request $request, Projet $project)
    {
        $user = auth()->user();
        if ($project->developer_id !== $user->id) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|in:architecture,api,deployment,database,setup,other',
        ]);

        $project->projectDocs()->create([
            'author_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? 'other',
            'is_client_visible' => false,
        ]);

        return redirect()->back()->with('success', 'Documentation ajoutée.');
    }

    public function updateDocs(Request $request, ProjectDoc $doc)
    {
        $user = auth()->user();
        if ($doc->project->developer_id !== $user->id) abort(403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|in:architecture,api,deployment,database,setup,other',
        ]);

        $doc->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? $doc->category,
        ]);

        return redirect()->back()->with('success', 'Documentation mise à jour.');
    }
}
