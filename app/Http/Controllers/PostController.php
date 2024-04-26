<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        
        return view('posts.index', compact('posts'));
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);
        return view('posts.show', compact('post')); 
    }

    public function create()
    {
        return view('dashboard'); 
    }

    public function destroy($id)
    {
        // Recherchez le post à supprimer
        $post = Post::findOrFail($id);

        // Assurez-vous que l'utilisateur actuel est autorisé à supprimer ce post
        // Vous pouvez ajouter des vérifications supplémentaires ici, par exemple, vérifier si l'utilisateur est l'auteur du post

        // Supprimez le post
        $post->delete();

        // Redirigez l'utilisateur vers la page d'index des posts avec un message de succès
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
        
        // Enregistrer la photo si elle a été téléchargée
        if ($request->hasFile('photo')) {
            $photoPath = $request->photo->store('photos', 'public');
            $post->photo = $photoPath;
        }

        // Enregistrer la publication dans la base de données
        $post->save();

        // Rediriger l'utilisateur vers la page d'accueil du blog avec un message de succès
        return redirect()->route('posts.index')->with('success', 'Publication créée avec succès!');
    }
}
