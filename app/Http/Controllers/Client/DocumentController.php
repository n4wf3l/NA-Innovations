<?php

namespace App\Http\Controllers\Client;

use App\Models\ProjectDocument;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Vérifie que le client connecté est bien propriétaire du projet.
     */
    private function checkOwnership(ProjectDocument $document): void
    {
        $document->load('project');

        if (!$document->project || $document->project->client_id !== Auth::id()) {
            abort(403, 'Vous n\'avez pas accès à ce document.');
        }
    }

    /**
     * Afficher un document.
     */
    public function show(ProjectDocument $document)
    {
        $this->checkOwnership($document);

        // Marquer comme vu si en attente de signature client
        if ($document->status === 'pending_client' && !$document->viewed_at) {
            $document->update([
                'viewed_at' => now(),
            ]);
        }

        $document->load(['template', 'adminSigner', 'clientSigner', 'project.client']);

        return Inertia::render('Client/Documents/Show', [
            'document' => $document,
            'pdfPreviewUrl' => "/client/documents/{$document->id}/pdf/preview",
        ]);
    }

    /**
     * Signer un document côté client.
     */
    public function sign(Request $request, ProjectDocument $document)
    {
        $this->checkOwnership($document);

        $validated = $request->validate([
            'signature_data' => 'required|string',
        ]);

        if (!in_array($document->status, ['pending_client', 'viewed'])) {
            return redirect()->back()->with('error', 'Ce document ne peut pas être signé dans son état actuel.');
        }

        // Compute client signature hash (eIDAS-lite)
        $signTimestamp = now()->toIso8601String();
        $signatureHash = hash('sha256', ($document->content ?? '') . Auth::user()->email . $signTimestamp . $document->document_reference);

        $document->update([
            'client_signed_by' => Auth::id(),
            'client_signature_data' => $validated['signature_data'],
            'client_signed_at' => $signTimestamp,
            'client_signed_ip' => $request->ip(),
            'client_signature_hash' => $signatureHash,
            'status' => 'countersigned',
        ]);

        \App\Models\DocumentSignatureHistory::create([
            'project_document_id' => $document->id,
            'signer_role' => 'client',
            'signer_user_id' => Auth::id(),
            'signature_data' => $validated['signature_data'],
            'signature_hash' => $signatureHash,
            'signed_ip' => $request->ip(),
            'signed_at' => $signTimestamp,
        ]);

        // Régénérer le PDF avec la signature du client
        PdfService::generateDocumentPdf($document);
        $document->refresh();

        $document->project->timelineEvents()->create([
            'user_id' => Auth::id(),
            'event_type' => 'document_countersigned',
            'title' => 'Document contresigné par le client',
            'description' => "Le document « {$document->title} » a été signé par le client.",
        ]);

        return redirect()->back()->with('success', 'Document signé avec succès. Merci !');
    }

    /**
     * Refuser un document.
     */
    public function reject(Request $request, ProjectDocument $document)
    {
        $this->checkOwnership($document);

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        if (!in_array($document->status, ['pending_client', 'viewed'])) {
            return redirect()->back()->with('error', 'Ce document ne peut pas être refusé dans son état actuel.');
        }

        $document->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
        ]);

        $document->project->timelineEvents()->create([
            'user_id' => Auth::id(),
            'event_type' => 'document_rejected',
            'title' => 'Document refusé par le client',
            'description' => "Le document « {$document->title} » a été refusé. Raison : {$validated['reason']}",
        ]);

        return redirect()->back()->with('success', 'Document refusé.');
    }

    /**
     * Télécharger le PDF du document.
     */
    public function downloadPdf(ProjectDocument $document)
    {
        $this->checkOwnership($document);

        if (!$document->pdf_path || !Storage::disk('local')->exists($document->pdf_path)) {
            PdfService::generateDocumentPdf($document);
            $document->refresh();
        }

        $filename = Str::slug($document->title) . '.pdf';

        return Storage::disk('local')->download($document->pdf_path, $filename);
    }

    /**
     * Prévisualiser le PDF du document dans le navigateur.
     */
    public function previewPdf(ProjectDocument $document)
    {
        $this->checkOwnership($document);

        if (!$document->pdf_path || !Storage::disk('local')->exists($document->pdf_path)) {
            PdfService::generateDocumentPdf($document);
            $document->refresh();
        }

        return response(Storage::disk('local')->get($document->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
