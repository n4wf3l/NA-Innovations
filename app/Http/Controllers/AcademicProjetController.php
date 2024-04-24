<?php

namespace App\Http\Controllers;

use App\Models\AcademicProjet;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class AcademicProjetController extends Controller
{

    public function index()
    {
        $academicProjects = AcademicProjet::all();
        return view('welcome', compact('academicProjects'));
    }

    public function create()
    {
        return view('academic_projects.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom_societe' => 'required|string|max:255',
            'type_societe' => 'required|string|max:255',
            'type_site' => 'required|string|max:255',
            'lieu' => 'required|string|max:255',
            'jours_developpement' => 'required|integer',
            'langage_programmation' => 'required|string|max:255',
            'etoiles' => 'required|string|max:255',
            'nombre_collaborateurs' => 'required|integer',
            'lien' => 'required|string|max:255',
            'image' => 'required|image',
        ]);


        $path = $request->file('image')->store('public/images');

        $projet = new AcademicProjet();
        $projet->nom_societe = $validatedData['nom_societe'];
        $projet->type_societe = $validatedData['type_societe'];
        $projet->type_site = $validatedData['type_site'];
        $projet->lieu = $validatedData['lieu'];
        $projet->jours_developpement = $validatedData['jours_developpement'];
        $projet->langage_programmation = $validatedData['langage_programmation'];
        $projet->etoiles = $validatedData['etoiles'];
        $projet->nombre_collaborateurs = $validatedData['nombre_collaborateurs'];
        $projet->lien = $validatedData['lien'];
        $projet->image = $path;
        $projet->save(); 

        return redirect('/dashboard')->with('success', 'Projet ajouté avec succès!');
    }

    public function destroy($id)
    {

        $academic_projet = AcademicProjet::findOrFail($id);
        
        if (Auth::id() != $academic_projet->user_id) {
        }
        
        $academic_projet->delete();
    }
}
