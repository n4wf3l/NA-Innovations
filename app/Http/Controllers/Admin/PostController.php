<?php

namespace App\Http\Controllers\Admin;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends BaseAdminController
{
    /**
     * Display a listing of posts with filters.
     */
    public function index(Request $request)
    {
        $query = Post::with('author');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        $categories = Post::whereNotNull('category')
            ->distinct()
            ->pluck('category');

        $counts = [
            'total' => Post::count(),
            'published' => Post::where('status', 'published')->count(),
            'draft' => Post::where('status', 'draft')->count(),
        ];

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'counts' => $counts,
            'filters' => $request->only(['status', 'category', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        $categories = Post::whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Posts/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'subject' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'cover_image' => 'nullable|image|max:5120',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Auto-generate slug if empty
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            $original = $validated['slug'];
            $count = 1;
            while (Post::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = "{$original}-{$count}";
                $count++;
            }
        }

        // Set published_at if publishing
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        }

        // Set author
        $validated['author_id'] = auth()->id();

        $post = Post::create($validated);

        // Calculate reading time
        $post->reading_time = $post->calculateReadingTime();
        $post->save();

        return redirect()->route('admin.posts.index')->with('success', 'Article créé avec succès.');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        $post->load('author');

        return Inertia::render('Admin/Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        $post->load('author');

        $categories = Post::whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug,' . $post->id,
            'subject' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'excerpt' => 'nullable|string|max:500',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'status' => 'required|in:draft,published',
            'published_at' => 'nullable|date',
            'cover_image' => 'nullable|image|max:5120',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Set published_at if publishing for the first time
        if ($validated['status'] === 'published' && empty($validated['published_at']) && !$post->published_at) {
            $validated['published_at'] = now();
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            if ($post->cover_image) {
                Storage::disk('public')->delete($post->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('posts', 'public');
        }

        $post->update($validated);

        // Recalculate reading time
        $post->reading_time = $post->calculateReadingTime();
        $post->save();

        return redirect()->route('admin.posts.index')->with('success', 'Article mis à jour avec succès.');
    }

    /**
     * Soft delete the specified post.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Article supprimé avec succès.');
    }
}
