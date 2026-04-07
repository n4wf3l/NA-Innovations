<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProspectingEmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProspectingEmailTemplateController extends BaseAdminController
{
    public function index()
    {
        $templates = ProspectingEmailTemplate::orderBy('sort_order')->orderBy('id')->get();

        return Inertia::render('Admin/Settings/ProspectingEmailTemplates', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        ProspectingEmailTemplate::create(array_merge([
            'sort_order' => 0,
            'is_active' => true,
        ], $validated));

        return redirect()->back()->with('success', __('Template ajouté avec succès.'));
    }

    public function update(Request $request, ProspectingEmailTemplate $prospectingEmailTemplate)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $prospectingEmailTemplate->update($validated);

        return redirect()->back()->with('success', __('Template mis à jour avec succès.'));
    }

    public function destroy(ProspectingEmailTemplate $prospectingEmailTemplate)
    {
        $prospectingEmailTemplate->delete();

        return redirect()->back()->with('success', __('Template supprimé.'));
    }

    public function toggleActive(ProspectingEmailTemplate $prospectingEmailTemplate)
    {
        $prospectingEmailTemplate->update(['is_active' => !$prospectingEmailTemplate->is_active]);

        return redirect()->back()->with('success', __('Statut mis à jour.'));
    }
}
