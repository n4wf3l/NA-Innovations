<?php

namespace App\Http\Controllers\Admin;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends BaseAdminController
{
    /**
     * Store a note on any notable entity.
     * Expects: notable_type (lead, project, client, quote, service), notable_id, content, is_private
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'notable_type' => 'required|string|in:lead,project,client,quote,service',
            'notable_id' => 'required|integer',
            'content' => 'required|string|max:5000',
            'is_private' => 'nullable|boolean',
            'is_pinned' => 'nullable|boolean',
        ]);

        $morphMap = [
            'lead' => \App\Models\Lead::class,
            'project' => \App\Models\Projet::class,
            'client' => \App\Models\User::class,
            'quote' => \App\Models\Quote::class,
            'service' => \App\Models\RecurringService::class,
        ];

        $modelClass = $morphMap[$validated['notable_type']] ?? null;
        if (!$modelClass) {
            return redirect()->back()->with('error', 'Type invalide.');
        }

        $entity = $modelClass::findOrFail($validated['notable_id']);

        $entity->notes()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'is_private' => $validated['is_private'] ?? true,
            'is_pinned' => $validated['is_pinned'] ?? false,
        ]);

        return redirect()->back()->with('success', 'Note ajoutée.');
    }

    /**
     * Toggle pin status.
     */
    public function togglePin(Note $note)
    {
        $note->update(['is_pinned' => !$note->is_pinned]);

        return redirect()->back()->with('success', $note->is_pinned ? 'Note épinglée.' : 'Note désépinglée.');
    }

    /**
     * Delete a note.
     */
    public function destroy(Note $note)
    {
        $note->delete();

        return redirect()->back()->with('success', 'Note supprimée.');
    }
}
