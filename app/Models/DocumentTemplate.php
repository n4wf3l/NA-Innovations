<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'category',
        'body',
        'available_variables',
        'default_locale',
        'requires_signature',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'available_variables' => 'array',
        'requires_signature' => 'boolean',
        'is_active' => 'boolean',
    ];
}
