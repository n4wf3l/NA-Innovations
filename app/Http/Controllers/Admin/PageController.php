<?php

namespace App\Http\Controllers\Admin;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends BaseAdminController
{
    /**
     * Display a listing of pages.
     */
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::orderBy('sort_order')->get(),
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create()
    {
        return Inertia::render('Admin/Pages/Create');
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'audience' => 'required|in:partner,developer,public',
            'is_published' => 'boolean',
            'sort_order' => 'integer|min:0',
            'icon' => 'nullable|string|max:1000',
        ]);

        Page::create($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully.');
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'audience' => 'required|in:partner,developer,public',
            'is_published' => 'boolean',
            'sort_order' => 'integer|min:0',
            'icon' => 'nullable|string|max:1000',
        ]);

        $page->update($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified page.
     */
    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }
}
