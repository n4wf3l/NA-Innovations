<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProspectingEmailTemplate extends Model
{
    protected $fillable = [
        'title',
        'body',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
