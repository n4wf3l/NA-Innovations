<?php

namespace App\Http\Controllers;

use App\Models\AcademicProjet;

use Illuminate\Http\Request;

class AcademicProjetController extends Controller
{

    public function index()
    {
        $academicProjects = AcademicProjet::all();
        return view('welcome', compact('academicProjects'));

    }

    public function create()
    {
        // Retourner la vue pour créer un nouveau projet académique
        return view('academic_projects.create');
    }

    public function store(Request $request)
    {
        // Valider les données entrantes
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

        // Charger l'image et obtenir le chemin
        $path = $request->file('image')->store('public/images');

        // Création de l'instance du modèle et assignation des champs
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
        $projet->image = $path; // Sauvegarder le chemin de l'image
        $projet->save(); // Sauvegarder l'instance dans la base de données

        return redirect('/dashboard')->with('success', 'Projet ajouté avec succès!');
    }
}
