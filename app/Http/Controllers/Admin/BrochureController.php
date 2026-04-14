<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrochureController extends BaseAdminController
{
    public function index()
    {
        $filePath = Setting::get('brochure.file_path', '');
        $exists = $filePath && Storage::disk('public')->exists($filePath);

        return Inertia::render('Admin/Settings/Brochure', [
            'brochure' => [
                'file_path' => $filePath,
                'url' => $exists ? route('public.brochure') : '',
                'updated_at' => Setting::get('brochure.updated_at', ''),
            ],
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'brochure' => 'required|file|mimes:pdf|max:10240',
        ]);

        $oldPath = Setting::get('brochure.file_path', '');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('brochure')->store('brochure', 'public');
        Setting::set('brochure.file_path', $path);
        Setting::set('brochure.updated_at', now()->toIso8601String());

        return redirect()->back()->with('success', 'Brochure mise à jour.');
    }

    public function destroy()
    {
        $path = Setting::get('brochure.file_path', '');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('brochure.file_path', '');
        Setting::set('brochure.updated_at', '');

        return redirect()->back()->with('success', 'Brochure supprimée.');
    }
}
