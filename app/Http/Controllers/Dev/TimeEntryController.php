<?php

namespace App\Http\Controllers\Dev;

use App\Models\Projet;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class TimeEntryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request, Projet $project)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        // Check dev is assigned to project
        if ($project->developer_id !== $user->id && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'You are not assigned to this project.');
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.25|max:24',
            'description' => 'required|string|max:500',
            'task_category' => 'nullable|string|in:development,design,meeting,testing,deployment,other',
            'is_billable' => 'boolean',
        ]);

        $validated['user_id'] = $user->id;
        $validated['project_id'] = $project->id;

        TimeEntry::create($validated);

        return redirect()->back()->with('success', 'Time entry added.');
    }

    public function update(Request $request, TimeEntry $entry)
    {
        $user = auth()->user();
        if ($entry->user_id !== $user->id) abort(403);

        $validated = $request->validate([
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.25|max:24',
            'description' => 'required|string|max:500',
            'task_category' => 'nullable|string|in:development,design,meeting,testing,deployment,other',
            'is_billable' => 'boolean',
        ]);

        $entry->update($validated);

        return redirect()->back()->with('success', 'Time entry updated.');
    }

    public function destroy(TimeEntry $entry)
    {
        $user = auth()->user();
        if ($entry->user_id !== $user->id) abort(403);

        $entry->delete();

        return redirect()->back()->with('success', 'Time entry deleted.');
    }
}
