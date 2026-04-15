<?php

namespace App\Http\Controllers\Admin;

use App\Models\DocumentTemplate;
use App\Models\ProjectDocument;
use App\Models\Projet;
use App\Services\NotificationService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectDocumentController extends BaseAdminController
{
    /**
     * Afficher les documents d'un projet.
     */
    public function index(Projet $project)
    {
        $documents = $project->projectDocuments()
            ->with([
                'template',
                'adminSigner',
                'clientSigner',
                'signatureHistory.signer:id,name',
                'signatureHistory.revoker:id,name',
            ])
            ->latest()
            ->get();

        $templates = DocumentTemplate::where('is_active', true)
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Projects/Documents', [
            'project' => $project->load('client'),
            'documents' => $documents,
            'templates' => $templates,
        ]);
    }

    /**
     * Générer un nouveau document pour un projet (brouillon, sans PDF).
     */
    public function generate(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'document_template_id' => 'required|exists:document_templates,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $document = $project->projectDocuments()->create([
            'document_template_id' => $validated['document_template_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'draft',
            'locale' => app()->getLocale(),
        ]);

        $project->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'document_created',
            'title' => 'Document créé',
            'description' => "Le document « {$document->title} » a été créé.",
        ]);

        return redirect()->route('admin.projects.documents', $project)
            ->with('success', 'Document généré avec succès.');
    }

    /**
     * Mettre à jour un document (si le contenu n'est pas verrouillé).
     */
    public function update(Request $request, Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403);
        }

        if ($document->isContentLocked()) {
            return redirect()->back()->with('error', 'Ce document a été signé et ne peut plus être modifié.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $document->update($validated);

        return redirect()->back()->with('success', 'Document mis à jour.');
    }

    /**
     * Signature administrateur sur un document.
     * Verrouille le contenu, stocke l'IP, génère le PDF.
     */
    public function adminSign(Request $request, Projet $project, ProjectDocument $document)
    {
        $validated = $request->validate([
            'signature_data' => 'required|string',
        ]);

        if ($document->project_id !== $project->id) {
            abort(403, 'Ce document n\'appartient pas à ce projet.');
        }

        if (!in_array($document->status, ['draft', 'pending_admin_signature'])) {
            return redirect()->back()->with('error', 'Ce document ne peut pas être signé dans son état actuel.');
        }

        // Compute signature hash (eIDAS-lite)
        $signTimestamp = now()->toIso8601String();
        $signatureHash = hash('sha256', ($document->content ?? '') . auth()->user()->email . $signTimestamp . $document->document_reference);

        $document->update([
            'admin_signed_by' => auth()->id(),
            'admin_signature_data' => $validated['signature_data'],
            'admin_signed_at' => $signTimestamp,
            'admin_signed_ip' => $request->ip(),
            'admin_signature_hash' => $signatureHash,
            'content_locked_at' => now(),
            'status' => 'pending_client',
        ]);

        \App\Models\DocumentSignatureHistory::create([
            'project_document_id' => $document->id,
            'signer_role' => 'admin',
            'signer_user_id' => auth()->id(),
            'signature_data' => $validated['signature_data'],
            'signature_hash' => $signatureHash,
            'signed_ip' => $request->ip(),
            'signed_at' => $signTimestamp,
        ]);

        // Générer le PDF après signature
        PdfService::generateDocumentPdf($document);
        $document->refresh();

        // Sauvegarder la signature sur le profil admin si différente
        $user = auth()->user();
        if ($user->signature !== $validated['signature_data']) {
            $user->signature = $validated['signature_data'];
            $user->save();
        }

        $project->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'document_signed',
            'title' => 'Document signé et verrouillé',
            'description' => "Le document « {$document->title} » a été signé et verrouillé par {$user->name}.",
        ]);

        return redirect()->back()->with('success', 'Document signé avec succès.');
    }

    /**
     * Demande une re-signature : archive les signatures actuelles et réinitialise le document.
     */
    public function requestResign(Request $request, Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $now = now();
        $userId = auth()->id();

        // Archive et révoque la signature admin actuelle (si existante)
        if ($document->admin_signed_at) {
            \App\Models\DocumentSignatureHistory::where('project_document_id', $document->id)
                ->where('signer_role', 'admin')
                ->whereNull('revoked_at')
                ->update([
                    'revoked_at' => $now,
                    'revoked_by' => $userId,
                    'revocation_reason' => $validated['reason'],
                ]);
        }

        // Archive et révoque la signature client actuelle (si existante)
        if ($document->client_signed_at) {
            \App\Models\DocumentSignatureHistory::where('project_document_id', $document->id)
                ->where('signer_role', 'client')
                ->whereNull('revoked_at')
                ->update([
                    'revoked_at' => $now,
                    'revoked_by' => $userId,
                    'revocation_reason' => $validated['reason'],
                ]);
        }

        // Réinitialise les champs de signature sur le document
        $document->update([
            'admin_signed_by' => null,
            'admin_signature_data' => null,
            'admin_signed_at' => null,
            'admin_signed_ip' => null,
            'admin_signature_hash' => null,
            'client_signed_by' => null,
            'client_signature_data' => null,
            'client_signed_at' => null,
            'client_signed_ip' => null,
            'client_signature_hash' => null,
            'content_locked_at' => null,
            'pdf_path' => null,
            'pdf_hash' => null,
            'status' => 'draft',
            'rejection_reason' => null,
        ]);

        $project->timelineEvents()->create([
            'user_id' => $userId,
            'event_type' => 'document_resign_requested',
            'title' => __('Re-signature demandée'),
            'description' => __('Les signatures du document « :title » ont été révoquées. Motif : :reason', ['title' => $document->title, 'reason' => $validated['reason']]),
        ]);

        return redirect()->back()->with('success', __('Signatures révoquées. Le document peut être modifié puis re-signé.'));
    }

    /**
     * Envoyer le document au client.
     */
    public function sendToClient(Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403, 'Ce document n\'appartient pas à ce projet.');
        }

        if ($document->status !== 'pending_client') {
            return redirect()->back()->with('error', 'Ce document ne peut pas être envoyé dans son état actuel.');
        }

        // Vérifier que le PDF existe avant l'envoi
        if (!$document->pdf_path || !Storage::disk('local')->exists($document->pdf_path)) {
            PdfService::generateDocumentPdf($document);
            $document->refresh();
        }

        $document->update([
            'sent_at' => now(),
        ]);

        // Send email notification to client with PDF attached
        if ($project->client) {
            NotificationService::send(
                $project->client,
                'document-sent',
                [
                    'client_name' => $project->client->name,
                    'document_title' => $document->title,
                    'project_name' => $project->nom_societe,
                ],
                attachmentPath: $document->pdf_path,
                transactional: true,
                actionUrl: "/client/documents/{$document->id}",
            );
        }

        $project->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'document_sent',
            'title' => 'Document envoyé au client',
            'description' => "Le document « {$document->title} » a été envoyé au client.",
        ]);

        return redirect()->back()->with('success', 'Document envoyé au client avec succès.');
    }

    /**
     * Télécharger le PDF du document.
     */
    public function downloadPdf(Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403, 'Ce document n\'appartient pas à ce projet.');
        }

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
    public function previewPdf(Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403);
        }

        if (!$document->pdf_path || !Storage::disk('local')->exists($document->pdf_path)) {
            PdfService::generateDocumentPdf($document);
            $document->refresh();
        }

        return response(Storage::disk('local')->get($document->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * Supprimer un document (uniquement si brouillon).
     */
    public function destroy(Projet $project, ProjectDocument $document)
    {
        if ($document->project_id !== $project->id) {
            abort(403, 'Ce document n\'appartient pas à ce projet.');
        }

        if ($document->status !== 'draft') {
            return redirect()->back()->with('error', 'Seuls les documents en brouillon peuvent être supprimés.');
        }

        $document->delete();

        return redirect()->route('admin.projects.documents', $project)
            ->with('success', 'Document supprimé avec succès.');
    }
}
