<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProjectDoc;
use App\Models\Projet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectDocController extends BaseAdminController
{
    public function index(Projet $project)
    {
        $docs = $project->projectDocs()
            ->with('author')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return Inertia::render('Admin/Projects/Docs', [
            'project' => $project,
            'docs' => $docs,
        ]);
    }

    public function store(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|in:architecture,api,deployment,database,setup,other',
            'is_client_visible' => 'nullable|boolean',
        ]);

        $project->projectDocs()->create([
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? 'other',
            'is_client_visible' => $request->boolean('is_client_visible', false),
        ]);

        return redirect()->back()->with('success', 'Documentation ajoutée.');
    }

    public function update(Request $request, ProjectDoc $doc)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|in:architecture,api,deployment,database,setup,other',
            'is_client_visible' => 'nullable|boolean',
        ]);

        $doc->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'] ?? $doc->category,
            'is_client_visible' => $request->boolean('is_client_visible', false),
        ]);

        return redirect()->back()->with('success', 'Documentation mise à jour.');
    }

    public function toggleVisibility(ProjectDoc $doc)
    {
        $doc->update(['is_client_visible' => !$doc->is_client_visible]);

        return redirect()->back()->with('success',
            $doc->is_client_visible
                ? 'Documentation visible pour le client.'
                : 'Documentation masquée pour le client.'
        );
    }

    public function destroy(ProjectDoc $doc)
    {
        $doc->delete();

        return redirect()->back()->with('success', 'Documentation supprimée.');
    }
}
