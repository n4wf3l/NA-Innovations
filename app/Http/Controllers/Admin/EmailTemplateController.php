<?php

namespace App\Http\Controllers\Admin;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailTemplateController extends BaseAdminController
{
    public function index()
    {
        $templates = EmailTemplate::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Admin/Settings/EmailTemplates', [
            'templates' => $templates,
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
