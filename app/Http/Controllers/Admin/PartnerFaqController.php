<?php

namespace App\Http\Controllers\Admin;

use App\Models\PartnerFaq;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerFaqController extends BaseAdminController
{
    public function index()
    {
        return Inertia::render('Admin/Settings/PartnerFaqs', [
            'faqs' => PartnerFaq::orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);
        PartnerFaq::create(array_merge(['category' => 'general', 'sort_order' => 0, 'is_active' => true], $data));
        return back()->with('success', __('FAQ ajoutée.'));
    }

    public function update(Request $request, PartnerFaq $partnerFaq)
    {
        $data = $request->validate([
            'question' => 'required|string|max:500',
            'answer' => 'required|string',
            'category' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);
        $partnerFaq->update($data);
        return back()->with('success', __('FAQ mise à jour.'));
    }

    public function destroy(PartnerFaq $partnerFaq)
    {
        $partnerFaq->delete();
        return back()->with('success', __('FAQ supprimée.'));
    }

    public function toggleActive(PartnerFaq $partnerFaq)
    {
        $partnerFaq->update(['is_active' => !$partnerFaq->is_active]);
        return back();
    }
}
