<?php

namespace App\Http\Controllers\Admin;

use App\Models\EmailTemplate;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailTemplateController extends BaseAdminController
{
    public function index()
    {
        $templates = EmailTemplate::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Settings/EmailTemplates', [
            'templates' => $templates,
            'signature' => [
                'enabled' => Setting::get('email_signature.enabled', '1'),
                'logo_path' => Setting::get('email_signature.logo_path', ''),
                'name' => Setting::get('email_signature.name', 'Nawfel Ajari'),
                'title' => Setting::get('email_signature.title', 'Founder & Developer'),
                'company' => Setting::get('email_signature.company', 'NA Innovations BV'),
                'phone' => Setting::get('email_signature.phone', ''),
                'email' => Setting::get('email_signature.email', 'info@nainnovations.be'),
                'website' => Setting::get('email_signature.website', 'www.nainnovations.be'),
                'address' => Setting::get('email_signature.address', ''),
                'linkedin' => Setting::get('email_signature.linkedin', ''),
                'instagram' => Setting::get('email_signature.instagram', ''),
                'github' => Setting::get('email_signature.github', ''),
                'color' => Setting::get('email_signature.color', '#0d9488'),
            ],
        ]);
    }

    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:500',
            'body' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $emailTemplate->update($validated);

        return redirect()->back()->with('success', 'Email template updated successfully.');
    }

    public function toggleActive(EmailTemplate $emailTemplate)
    {
        $emailTemplate->update(['is_active' => !$emailTemplate->is_active]);

        return redirect()->back()->with('success', 'Template status updated.');
    }
}
