<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_societe',
        'type_societe',
        'type_site', // Corrigé pour correspondre à la migration
        'lieu',
        'jours_developpement',
        'langage_programmation',
        'etoiles', // Corrigé pour correspondre à la migration
        'nombre_collaborateurs',
        'lien',
        'image',
    ];
}
