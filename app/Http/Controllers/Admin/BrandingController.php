<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandingController extends BaseAdminController
{
    public function index()
    {
        $socialLinks = Setting::where('group', 'social')->orderBy('key')->get()
            ->map(fn($s) => ['key' => str_replace('social.', '', $s->key), 'url' => $s->value, 'description' => $s->description]);

        $branding = [
            'logo_path' => Setting::get('branding.logo_path', ''),
            'company_name' => Setting::get('branding.company_name', 'NA Innovations'),
            'tagline' => Setting::get('branding.tagline', ''),
            'video_url' => Setting::get('branding.video_url', ''),
        ];

        return Inertia::render('Admin/Settings/Branding', [
            'socialLinks' => $socialLinks,
            'branding' => $branding,
        ]);
    }

    public function updateSocial(Request $request)
    {
        $validated = $request->validate([
            'links' => 'required|array',
            'links.*.key' => 'required|string',
            'links.*.url' => 'nullable|string|max:500',
        ]);

        foreach ($validated['links'] as $link) {
            Setting::set("social.{$link['key']}", $link['url'] ?? '');
        }

        return redirect()->back()->with('success', 'Réseaux sociaux mis à jour.');
    }

    public function updateBranding(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'video_url' => 'nullable|string|max:500',
        ]);

        Setting::set('branding.company_name', $request->company_name);
        Setting::set('branding.tagline', $request->tagline ?? '');
        Setting::set('branding.video_url', $request->video_url ?? '');

        return redirect()->back()->with('success', 'Informations de marque mises à jour.');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        // Delete old logo if exists
        $oldPath = Setting::get('branding.logo_path', '');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('logo')->store('branding', 'public');
        Setting::set('branding.logo_path', $path);

        return redirect()->back()->with('success', 'Logo mis à jour.');
    }

    public function deleteLogo()
    {
        $path = Setting::get('branding.logo_path', '');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('branding.logo_path', '');

        return redirect()->back()->with('success', 'Logo supprimé.');
    }
}
