<?php

namespace App\Http\Controllers\Admin;

use App\Models\DocumentTemplate;
use App\Models\ProjectDocument;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentTemplateController extends BaseAdminController
{
    /**
     * Afficher tous les modèles de documents.
     */
    public function index()
    {
        $templates = DocumentTemplate::orderBy('category')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Settings/DocumentTemplates', [
            'templates' => $templates,
        ]);
    }

    /**
     * Mettre à jour un modèle de document.
     */
    public function update(Request $request, DocumentTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'body' => 'required|string',
            'available_variables' => 'nullable|array',
            'requires_signature' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);

        return redirect()->back()->with('success', 'Modèle de document mis à jour avec succès.');
    }

    /**
     * Aperçu PDF du modèle avec des données d'exemple.
     */
    public function preview(DocumentTemplate $template)
    {
        $exampleData = [
            'client_name' => 'Jean Dupont',
            'client_company' => 'Dupont SARL',
            'agency_name' => Setting::get('company.name', 'NA Innovations'),
            'project_name' => 'Site Vitrine Exemple',
            'date' => now()->format('d/m/Y'),
            'duration_months' => '12',
            'jurisdiction' => 'belge',
            'scope' => 'Développement d\'un site vitrine responsive avec formulaire de contact, galerie photos et intégration SEO.',
            'budget' => '5 000 €',
            'timeline' => '8 semaines',
            'payment_terms' => '30% à la commande, 70% à la livraison',
            'delivery_date' => now()->addMonths(2)->format('d/m/Y'),
            'deliverables' => 'Site web complet, code source, documentation technique, formation administrateur',
            'remarks' => 'RAS — Livraison conforme au cahier des charges.',
            'tech_stack' => 'Laravel 10, React 18, TypeScript, Tailwind CSS, MySQL',
            'features' => 'Authentification, tableau de bord, gestion de contenu, API REST, notifications',
            'architecture' => 'Architecture MVC avec API REST, base de données relationnelle, déploiement sur serveur VPS',
            'portal_url' => 'https://app.na-innovations.be',
        ];

        $content = $template->body;
        foreach ($exampleData as $key => $value) {
            $content = str_replace("{{ {$key} }}", $value, $content);
        }

        $fakeDocument = new ProjectDocument([
            'title' => $template->name,
            'content' => $content,
            'document_reference' => 'DOC-PREVIEW',
            'locale' => 'fr',
            'status' => 'draft',
        ]);
        $fakeDocument->id = 0;
        $fakeDocument->created_at = now();

        $data = [
            'document' => $fakeDocument,
            'company' => [
                'name' => Setting::get('company.name', 'NA Innovations'),
                'address' => Setting::get('company.address', '170 Nijverheidskaai, Anderlecht'),
                'email' => Setting::get('company.email', config('mail.from.address', 'info@nainnovations.be')),
                'phone' => Setting::get('company.phone', ''),
                'vat' => Setting::get('company.vat', ''),
                'country' => Setting::get('company.country', 'Belgique'),
            ],
        ];

        $pdf = Pdf::loadView('pdf.document', $data)->setPaper('a4');

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * Activer ou désactiver un modèle de document.
     */
    public function toggleActive(DocumentTemplate $template)
    {
        $template->update([
            'is_active' => !$template->is_active,
        ]);

        $status = $template->is_active ? 'activé' : 'désactivé';

        return redirect()->back()->with('success', "Modèle de document {$status} avec succès.");
    }
}
