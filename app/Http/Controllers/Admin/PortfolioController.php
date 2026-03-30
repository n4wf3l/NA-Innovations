<?php

namespace App\Http\Controllers\Admin;

use App\Models\Projet;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController extends BaseAdminController
{
    public function index()
    {
        $projects = Projet::where('is_portfolio', true)
            ->with(['client', 'portfolioProject.images'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $availableProjects = Projet::where('is_portfolio', false)
            ->whereIn('status', ['completed', 'in_progress', 'review'])
            ->with('client')
            ->orderBy('nom_societe')
            ->get();

        $published = $projects->filter(fn($p) => $p->portfolioProject?->is_published)->count();

        return Inertia::render('Admin/Portfolio/Index', [
            'projects' => $projects,
            'availableProjects' => $availableProjects,
            'publishedCount' => $published,
        ]);
    }

    public function addToPortfolio(Projet $projet)
    {
        $projet->update(['is_portfolio' => true]);

        // Create PortfolioProject if it doesn't exist
        if (!$projet->portfolioProject) {
            $projet->portfolioProject()->create([
                'title' => $projet->nom_societe,
                'slug' => \Illuminate\Support\Str::slug($projet->nom_societe),
                'client_name' => $projet->client?->company_name ?? $projet->client?->name ?? $projet->nom_societe,
                'excerpt' => $projet->description ? \Illuminate\Support\Str::limit($projet->description, 200) : '',
                'tech_stack' => [],
                'features' => [],
                'tags' => [],
                'is_published' => false,
            ]);
        }

        return redirect()->route('admin.portfolio.edit', $projet)->with('success', 'Projet ajouté au portfolio. Complétez les détails.');
    }

    public function edit(Projet $projet)
    {
        $projet->load(['client', 'developer', 'portfolioProject.images']);

        if (!$projet->portfolioProject) {
            $projet->portfolioProject()->create([
                'title' => $projet->nom_societe,
                'slug' => \Illuminate\Support\Str::slug($projet->nom_societe),
                'client_name' => $projet->client?->company_name ?? $projet->client?->name ?? $projet->nom_societe,
                'excerpt' => $projet->description ? \Illuminate\Support\Str::limit($projet->description, 200) : '',
                'tech_stack' => [],
                'features' => [],
                'tags' => [],
                'is_published' => false,
            ]);
            $projet->load('portfolioProject.images');
        }

        return Inertia::render('Admin/Portfolio/Edit', [
            'project' => $projet,
            'portfolio' => $projet->portfolioProject,
        ]);
    }

    public function update(Request $request, Projet $projet)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'context' => 'nullable|string',
            'challenge' => 'nullable|string',
            'solution' => 'nullable|string',
            'results' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'tech_stack' => 'nullable|array',
            'tech_stack.*' => 'string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:100',
            'live_url' => 'nullable|url|max:500',
            'category' => 'nullable|string|max:100',
            'duration_days' => 'nullable|integer|min:1',
            'testimonial_text' => 'nullable|string',
            'testimonial_author' => 'nullable|string|max:255',
            'testimonial_role' => 'nullable|string|max:255',
            'is_published' => 'nullable',
            'is_featured' => 'nullable',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['is_published'] = filter_var($validated['is_published'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $validated['is_featured'] = filter_var($validated['is_featured'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $portfolio = $projet->portfolioProject;
        $portfolio->update($validated);

        if (!$projet->is_portfolio) {
            $projet->update(['is_portfolio' => true]);
        }

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio mis à jour.');
    }

    public function uploadImage(Request $request, Projet $projet)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'images' => 'nullable|array|max:20',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'alt_text' => 'nullable|string|max:255',
        ]);

        $files = [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
        } elseif ($request->hasFile('image')) {
            $files = [$request->file('image')];
        }

        if (empty($files)) {
            return redirect()->back()->with('error', 'Aucune image fournie.');
        }

        $maxOrder = $projet->portfolioProject->images()->max('sort_order') ?? 0;
        $count = 0;

        foreach ($files as $file) {
            $path = $file->store('portfolio', 'public');
            $projet->portfolioProject->images()->create([
                'image_path' => $path,
                'alt_text' => $request->input('alt_text', $projet->nom_societe),
                'sort_order' => ++$maxOrder,
            ]);
            $count++;
        }

        $msg = $count === 1 ? 'Image ajoutée.' : "{$count} images ajoutées.";
        return redirect()->back()->with('success', $msg);
    }

    public function deleteImage(PortfolioImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return redirect()->back()->with('success', 'Image supprimée.');
    }

    public function uploadLogo(Request $request, Projet $projet)
    {
        $request->validate([
            'client_logo' => 'required|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $portfolio = $projet->portfolioProject;
        if (!$portfolio) abort(404);

        // Delete old logo
        if ($portfolio->client_logo && Storage::disk('public')->exists($portfolio->client_logo)) {
            Storage::disk('public')->delete($portfolio->client_logo);
        }

        $path = $request->file('client_logo')->store('portfolio/logos', 'public');
        $portfolio->update(['client_logo' => $path]);

        return redirect()->back()->with('success', 'Logo client mis à jour.');
    }

    public function deleteLogo(Projet $projet)
    {
        $portfolio = $projet->portfolioProject;
        if (!$portfolio) abort(404);

        if ($portfolio->client_logo && Storage::disk('public')->exists($portfolio->client_logo)) {
            Storage::disk('public')->delete($portfolio->client_logo);
        }
        $portfolio->update(['client_logo' => null]);

        return redirect()->back()->with('success', 'Logo supprimé.');
    }

    public function togglePublished(Projet $projet)
    {
        $portfolio = $projet->portfolioProject;
        if ($portfolio) {
            $portfolio->update(['is_published' => !$portfolio->is_published]);
        }

        return redirect()->back()->with('success', $portfolio && $portfolio->is_published ? 'Projet publié.' : 'Projet retiré.');
    }
}
