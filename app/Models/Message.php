<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * Les attributs de la table messages qui peuvent être remplis.
     *
     * @var array
     */
    protected $fillable = [
        'content',
        'enabled',
    ];

    /**
     * Indique si les timestamps doivent être enregistrés pour le modèle.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Les attributs à masquer pour les tableaux JSON.
     *
     * @var array
     */
    protected $hidden = [
        // Les attributs que vous souhaitez masquer lorsque vous convertissez le modèle en tableau ou en JSON
    ];

    /**
     * Les attributs à convertir en types natifs.
     *
     * @var array
     */
    protected $casts = [
        'enabled' => 'boolean',
    ];
}
