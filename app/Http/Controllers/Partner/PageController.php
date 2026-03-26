<?php

namespace App\Http\Controllers\Partner;

use App\Models\Page;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::where('audience', 'partner')
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'icon']);

        return Inertia::render('Partner/Pages/Index', ['pages' => $pages]);
    }

    public function show(string $slug)
    {
        $page = Page::where('slug', $slug)
            ->where('audience', 'partner')
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Partner/Pages/Show', ['page' => $page]);
    }
}
