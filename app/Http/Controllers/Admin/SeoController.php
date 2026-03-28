<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SeoController extends BaseAdminController
{
    public function index()
    {
        $seoSettings = Setting::where('group', 'seo')->get()
            ->mapWithKeys(fn($s) => [$s->key => $s->value]);

        return Inertia::render('Admin/Settings/Seo', [
            'seoSettings' => $seoSettings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string|max:500',
        ]);

        foreach ($validated['settings'] as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'] ?? '',
                    'group' => 'seo',
                    'type' => 'string',
                ]
            );
        }

        return redirect()->back()->with('success', 'Paramètres SEO mis à jour avec succès.');
    }

    public function uploadOgImage(Request $request)
    {
        $request->validate([
            'page' => 'required|string|in:home,projects,contact,about',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        $page = $request->input('page');
        $key = "seo.{$page}_og_image";

        // Delete old image
        $old = Setting::get($key);
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }

        $path = $request->file('image')->store('seo', 'public');

        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $path, 'group' => 'seo', 'type' => 'string']
        );

        return redirect()->back()->with('success', 'Image OG mise à jour.');
    }
}
