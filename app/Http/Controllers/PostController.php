<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->paginate(9);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    public function create()
    {
        return view('dashboard');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();

        return redirect()->route('posts.index')->with('success', 'Post supprimé avec succès!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'subject' => 'required',
            'description' => 'required',
            'photo' => 'nullable|image|max:2048',
        ]);

        $post = new Post();
        $post->title = $request->title;
        $post->subject = $request->subject;
        $post->description = $request->description;

        if ($request->hasFile('photo')) {
            $photoPath = $request->photo->store('photos', 'public');
            $post->photo = $photoPath;
        }

        $post->save();

        return redirect()->route('posts.index')->with('success', 'Publication créée avec succès!');
    }
}
