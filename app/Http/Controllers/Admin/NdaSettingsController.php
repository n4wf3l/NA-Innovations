<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NdaSettingsController extends BaseAdminController
{
    public function index()
    {
        return Inertia::render('Admin/Settings/NdaSettings', [
            'ndaMode' => Setting::get('kb.nda_mode', 'text'),
            'ndaText' => Setting::get('kb.nda_text', ''),
            'ndaPdfPath' => Setting::get('kb.nda_pdf_path'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'nda_mode' => 'required|in:text,pdf',
            'nda_text' => 'nullable|string',
        ]);

        Setting::set('kb.nda_mode', $validated['nda_mode']);

        if ($validated['nda_mode'] === 'text' && $validated['nda_text']) {
            Setting::set('kb.nda_text', $validated['nda_text']);
        }

        return redirect()->back()->with('success', 'Paramètres NDA mis à jour.');
    }

    public function uploadPdf(Request $request)
    {
        $request->validate([
            'nda_pdf' => 'required|file|mimes:pdf|max:10240',
        ]);

        // Delete old PDF if exists
        $oldPath = Setting::get('kb.nda_pdf_path');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('nda_pdf')->store('nda', 'public');
        Setting::set('kb.nda_pdf_path', $path);
        Setting::set('kb.nda_mode', 'pdf');

        return redirect()->back()->with('success', 'PDF NDA uploadé avec succès.');
    }

    public function deletePdf()
    {
        $path = Setting::get('kb.nda_pdf_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('kb.nda_pdf_path', null);
        Setting::set('kb.nda_mode', 'text');

        return redirect()->back()->with('success', 'PDF NDA supprimé. Mode texte réactivé.');
    }
}
