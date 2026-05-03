<?php

namespace App\Http\Controllers\Admin;

use App\Models\Product;
use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends BaseAdminController
{
    public function index()
    {
        $products = Product::with('project')
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $projects = Projet::orderBy('nom_societe')->get(['id', 'nom_societe']);

        return Inertia::render('Admin/Products/Create', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'tech_stack' => 'nullable|array',
            'tech_stack.*' => 'string|max:100',
            'pricing_monthly' => 'nullable|numeric|min:0',
            'pricing_yearly' => 'nullable|numeric|min:0',
            'pricing_custom' => 'boolean',
            'status' => 'required|in:in_development,beta,launched',
            'live_url' => 'nullable|url|max:500',
            'demo_url' => 'nullable|url|max:500',
            'video_url' => 'nullable|url|max:500',
            'show_video' => 'boolean',
            'target_audience' => 'nullable|string|max:500',
            'project_id' => 'nullable|exists:projets,id',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
            'launched_at' => 'nullable|date',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produit créé avec succès.');
    }

    public function edit(Product $product)
    {
        $projects = Projet::orderBy('nom_societe')->get(['id', 'nom_societe']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'projects' => $projects,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'tech_stack' => 'nullable|array',
            'tech_stack.*' => 'string|max:100',
            'pricing_monthly' => 'nullable|numeric|min:0',
            'pricing_yearly' => 'nullable|numeric|min:0',
            'pricing_custom' => 'boolean',
            'status' => 'required|in:in_development,beta,launched',
            'live_url' => 'nullable|url|max:500',
            'demo_url' => 'nullable|url|max:500',
            'video_url' => 'nullable|url|max:500',
            'show_video' => 'boolean',
            'target_audience' => 'nullable|string|max:500',
            'project_id' => 'nullable|exists:projets,id',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer|min:0',
            'launched_at' => 'nullable|date',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé.');
    }

    public function uploadLogo(Request $request, Product $product)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        if ($product->logo_path) {
            Storage::disk('public')->delete($product->logo_path);
        }

        $path = $request->file('logo')->store('products/logos', 'public');
        $product->update(['logo_path' => $path]);

        return redirect()->back()->with('success', 'Logo mis à jour.');
    }

    public function uploadCover(Request $request, Product $product)
    {
        $request->validate([
            'cover' => 'required|image|max:4096',
        ]);

        if ($product->cover_image_path) {
            Storage::disk('public')->delete($product->cover_image_path);
        }

        $path = $request->file('cover')->store('products/covers', 'public');
        $product->update(['cover_image_path' => $path]);

        return redirect()->back()->with('success', 'Image de couverture mise à jour.');
    }

    public function togglePublished(Product $product)
    {
        $product->update(['is_published' => !$product->is_published]);

        return redirect()->back()->with('success', $product->is_published ? 'Produit publié.' : 'Produit dépublié.');
    }
}
