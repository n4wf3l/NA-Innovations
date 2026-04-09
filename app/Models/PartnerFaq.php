<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerFaq extends Model
{
    protected $fillable = ['question', 'answer', 'category', 'sort_order', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
