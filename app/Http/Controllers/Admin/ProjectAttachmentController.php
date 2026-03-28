<?php

namespace App\Http\Controllers\Admin;

use App\Models\Document;
use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectAttachmentController extends BaseAdminController
{
    public function store(Request $request, Projet $project)
    {
        $request->validate([
            'file' => 'required|file|max:20480', // 20MB max
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:quote,invoice,contract,brief,specification,other',
            'description' => 'nullable|string|max:500',
            'is_client_visible' => 'nullable|boolean',
        ]);

        $file = $request->file('file');
        $path = $file->store("project-attachments/{$project->id}", 'local');

        $project->documents()->create([
            'uploaded_by' => auth()->id(),
            'name' => $request->name,
            'original_filename' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'category' => $request->category,
            'description' => $request->description,
            'is_client_visible' => $request->boolean('is_client_visible', false),
        ]);

        // Timeline event
        $project->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'document_uploaded',
            'title' => "Document ajouté : {$request->name}",
            'description' => "Catégorie : {$request->category} — {$file->getClientOriginalName()} (" . round($file->getSize() / 1024) . " KB)",
        ]);

        return redirect()->back()->with('success', 'Document ajouté avec succès.');
    }

    public function download(Projet $project, Document $document)
    {
        if ($document->documentable_id !== $project->id || $document->documentable_type !== Projet::class) {
            abort(403);
        }

        if (!Storage::disk('local')->exists($document->file_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($document->file_path, $document->original_filename);
    }

    public function toggleVisibility(Projet $project, Document $document)
    {
        if ($document->documentable_id !== $project->id) {
            abort(403);
        }

        $document->update(['is_client_visible' => !$document->is_client_visible]);

        return redirect()->back()->with('success', $document->is_client_visible ? 'Document visible pour le client.' : 'Document masqué pour le client.');
    }

    public function destroy(Projet $project, Document $document)
    {
        if ($document->documentable_id !== $project->id) {
            abort(403);
        }

        if (Storage::disk('local')->exists($document->file_path)) {
            Storage::disk('local')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with('success', 'Document supprimé.');
    }
}
