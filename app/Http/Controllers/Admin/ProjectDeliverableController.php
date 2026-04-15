<?php

namespace App\Http\Controllers\Admin;

use App\Models\Projet;
use App\Models\ProjectDeliverable;
use Illuminate\Http\Request;

class ProjectDeliverableController extends BaseAdminController
{
    public function store(Request $request, Projet $project)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $maxOrder = $project->deliverables()->max('sort_order') ?? 0;

        $project->deliverables()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'sort_order' => $maxOrder + 1,
            'created_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', __('Livrable ajouté.'));
    }

    public function update(Request $request, ProjectDeliverable $deliverable)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $deliverable->update($data);

        return redirect()->back()->with('success', __('Livrable mis à jour.'));
    }

    public function toggle(ProjectDeliverable $deliverable)
    {
        $user = auth()->user();
        $deliverable->loadMissing('project');

        if ($user->role === 'developer') {
            if (!$user->deliverables_checklist_enabled) {
                abort(403, __('La checklist livrables n\'est pas activée pour votre compte.'));
            }
            if ($deliverable->project?->developer_id !== $user->id) {
                abort(403);
            }
        } elseif ($user->role !== 'admin') {
            abort(403);
        }

        if ($deliverable->is_completed) {
            $deliverable->update([
                'is_completed' => false,
                'completed_at' => null,
                'completed_by' => null,
            ]);
        } else {
            $deliverable->update([
                'is_completed' => true,
                'completed_at' => now(),
                'completed_by' => $user->id,
            ]);
        }

        return redirect()->back();
    }

    public function destroy(ProjectDeliverable $deliverable)
    {
        $deliverable->delete();
        return redirect()->back()->with('success', __('Livrable supprimé.'));
    }

    public function reorder(Request $request, Projet $project)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:project_deliverables,id',
        ]);

        foreach ($data['ids'] as $index => $id) {
            ProjectDeliverable::where('id', $id)
                ->where('project_id', $project->id)
                ->update(['sort_order' => $index + 1]);
        }

        return response()->noContent();
    }
}
