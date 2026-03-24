<?php

namespace App\Http\Controllers\Admin;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends BaseAdminController
{
    /**
     * Display a listing of posts.
     */
    public function index()
    {
        $posts = Post::orderBy('created_at', 'desc')->paginate(15);

        return view('admin.posts.index', compact('posts'));
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        return view('admin.posts.create');
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('public/photos');
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Post created successfully.');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        return view('admin.posts.edit', compact('post'));
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if it exists
            if ($post->photo) {
                Storage::delete($post->photo);
            }
            $validated['photo'] = $request->file('photo')->store('public/photos');
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post)
    {
        if ($post->photo) {
            Storage::delete($post->photo);
        }

        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Post deleted successfully.');
    }
}
