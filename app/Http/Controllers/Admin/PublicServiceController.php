<?php

namespace App\Http\Controllers\Admin;

use App\Models\PublicService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicServiceController extends BaseAdminController
{
    public function index()
    {
        $services = PublicService::orderBy('sort_order')->get();

        return Inertia::render('Admin/Settings/PublicServices', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        PublicService::create($validated);

        return redirect()->back()->with('success', 'Service créé avec succès.');
    }

    public function update(Request $request, PublicService $public_service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $public_service->update($validated);

        return redirect()->back()->with('success', 'Service mis à jour avec succès.');
    }

    public function destroy(PublicService $public_service)
    {
        $public_service->delete();

        return redirect()->back()->with('success', 'Service supprimé avec succès.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'order' => 'required|array',
            'order.*.id' => 'required|exists:public_services,id',
            'order.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['order'] as $item) {
            PublicService::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back()->with('success', 'Ordre mis à jour avec succès.');
    }
}
