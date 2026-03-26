<?php
namespace App\Http\Controllers\Dev;

use App\Models\Projet;
use App\Models\NotificationLog;
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

        $project->load('client', 'developer', 'lead.referralPartner.user', 'timelineEvents', 'quotes', 'invoices');

        return Inertia::render('Dev/Projects/Show', [
            'project' => $project,
        ]);
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
}
