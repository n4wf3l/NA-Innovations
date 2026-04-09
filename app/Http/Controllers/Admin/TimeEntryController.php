<?php

namespace App\Http\Controllers\Admin;

use App\Models\Projet;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends BaseAdminController
{
    public function index(Request $request)
    {
        $query = TimeEntry::with(['project', 'user']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $entries = $query->orderByDesc('date')->orderByDesc('created_at')->paginate(50)->withQueryString();

        // Summary stats
        $summaryQuery = TimeEntry::query();
        if ($request->filled('project_id')) $summaryQuery->where('project_id', $request->project_id);
        if ($request->filled('user_id')) $summaryQuery->where('user_id', $request->user_id);
        if ($request->filled('date_from')) $summaryQuery->where('date', '>=', $request->date_from);
        if ($request->filled('date_to')) $summaryQuery->where('date', '<=', $request->date_to);

        $allFiltered = $summaryQuery->get();
        $totalHours = $allFiltered->sum('hours');
        $totalBillable = $allFiltered->where('is_billable', true)->sum('hours');

        $hoursByProject = $allFiltered->groupBy('project_id')->map(fn($g) => round($g->sum('hours'), 2));
        $hoursByDev = $allFiltered->groupBy('user_id')->map(fn($g) => round($g->sum('hours'), 2));

        // Load names for breakdown
        $projects = Projet::whereIn('id', $hoursByProject->keys())->pluck('nom_societe', 'id');
        $developers = User::whereIn('id', $hoursByDev->keys())->pluck('name', 'id');

        $projectBreakdown = $hoursByProject->mapWithKeys(fn($h, $id) => [($projects[$id] ?? "Projet #$id") => $h]);
        $devBreakdown = $hoursByDev->mapWithKeys(fn($h, $id) => [($developers[$id] ?? "Dev #$id") => $h]);

        return Inertia::render('Admin/Timesheets/Index', [
            'entries' => $entries,
            'filters' => $request->only(['project_id', 'user_id', 'date_from', 'date_to']),
            'projects' => Projet::orderBy('nom_societe')->get(['id', 'nom_societe']),
            'developers' => User::whereIn('role', ['developer', 'admin'])->orderBy('name')->get(['id', 'name']),
            'summary' => [
                'total_hours' => round($totalHours, 2),
                'total_billable' => round($totalBillable, 2),
                'by_project' => $projectBreakdown,
                'by_developer' => $devBreakdown,
            ],
        ]);
    }

    public function pending()
    {
        $entries = TimeEntry::with(['project', 'user'])
            ->where('approval_status', 'pending')
            ->orderByDesc('date')
            ->paginate(50);

        return Inertia::render('Admin/TimeEntries/Pending', [
            'entries' => $entries,
        ]);
    }

    public function approve(TimeEntry $entry)
    {
        $entry->update([
            'approval_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);
        return redirect()->back()->with('success', __('Entrée approuvée.'));
    }

    public function reject(Request $request, TimeEntry $entry)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);
        $entry->update([
            'approval_status' => 'rejected',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => $request->input('reason'),
        ]);
        return redirect()->back()->with('success', __('Entrée rejetée.'));
    }
}
