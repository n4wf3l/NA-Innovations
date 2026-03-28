<?php

namespace App\Http\Controllers\Admin;

use App\Models\LandingSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingSectionController extends BaseAdminController
{
    public function index()
    {
        $sections = LandingSection::orderBy('sort_order')->get();

        return Inertia::render('Admin/Settings/LandingSections', [
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, LandingSection $section)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'button_text' => 'nullable|string|max:255',
            'button_url' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'metadata' => 'nullable|array',
        ]);

        $section->update($validated);

        return redirect()->back()->with('success', 'Section mise à jour avec succès.');
    }

    public function uploadImage(Request $request, LandingSection $section)
    {
        $request->validate([
            'background_image' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:4096',
        ]);

        // Delete old image if exists
        if ($section->background_image && Storage::disk('public')->exists($section->background_image)) {
            Storage::disk('public')->delete($section->background_image);
        }

        $path = $request->file('background_image')->store('landing', 'public');
        $section->update(['background_image' => $path]);

        return redirect()->back()->with('success', 'Image mise à jour avec succès.');
    }
}
