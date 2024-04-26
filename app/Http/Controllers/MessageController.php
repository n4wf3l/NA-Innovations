<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Projet;
use App\Models\AcademicProjet;


class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::all();
        return view('dashboard', compact('messages'));
    }
    public function store(Request $request)
{
    $request->validate([
        'content' => 'required|string',
        'enabled' => 'boolean',
    ]);

    // Récupérez le premier message activé s'il existe
    $message = Message::where('enabled', true)->first();

    // Si un message activé existe, mettez à jour ce message
    if ($message) {
        $message->update([
            'content' => $request->input('content'),
            'enabled' => $request->has('enabled'),
        ]);
    } else {
        // Sinon, créez un nouveau message
        $message = new Message();
        $message->content = $request->input('content');
        $message->enabled = $request->has('enabled');
        $message->save();
    }

    return redirect()->route('dashboard')->with('success', 'Message ajouté avec succès!');
}
    

public function welcomeMessages()
{
    $projets = Projet::all();
    $academicProjects = AcademicProjet::all();
    // Récupérer tous les messages activés depuis la base de données
    $messages = Message::where('enabled', true)->get();
    return view('welcome', compact('projets', 'academicProjects', 'messages'));
}

    }

