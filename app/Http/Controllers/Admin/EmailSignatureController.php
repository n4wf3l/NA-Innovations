<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmailSignatureController extends BaseAdminController
{
    public function index()
    {
        return Inertia::render('Admin/Settings/EmailSignature', [
            'signature' => [
                'enabled' => Setting::get('email_signature.enabled', '1'),
                'logo_path' => Setting::get('email_signature.logo_path', ''),
                'name' => Setting::get('email_signature.name', 'Nawfel Ajari'),
                'title' => Setting::get('email_signature.title', 'Founder & Developer'),
                'company' => Setting::get('email_signature.company', 'NA Innovations BV'),
                'phone' => Setting::get('email_signature.phone', '+32 490 22 19 12'),
                'email' => Setting::get('email_signature.email', 'info@nainnovations.be'),
                'website' => Setting::get('email_signature.website', 'www.nainnovations.be'),
                'address' => Setting::get('email_signature.address', '170 Nijverheidskaai, Anderlecht'),
                'linkedin' => Setting::get('email_signature.linkedin', ''),
                'instagram' => Setting::get('email_signature.instagram', ''),
                'github' => Setting::get('email_signature.github', ''),
                'color' => Setting::get('email_signature.color', '#0d9488'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $fields = ['enabled', 'name', 'title', 'company', 'phone', 'email', 'website', 'address', 'linkedin', 'instagram', 'github', 'color'];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                Setting::set("email_signature.{$field}", $request->input($field, ''));
            }
        }

        return back()->with('success', 'Signature email mise à jour.');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate(['logo' => 'required|image|max:2048']);

        $old = Setting::get('email_signature.logo_path');
        if ($old && Storage::disk('public')->exists($old)) {
            Storage::disk('public')->delete($old);
        }

        $path = $request->file('logo')->store('email-signature', 'public');
        Setting::set('email_signature.logo_path', $path);

        return back()->with('success', 'Logo de signature mis à jour.');
    }

    public function deleteLogo()
    {
        $path = Setting::get('email_signature.logo_path');
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        Setting::set('email_signature.logo_path', '');

        return back()->with('success', 'Logo supprimé.');
    }
}
