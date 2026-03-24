<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutomationRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'event',
        'action',
        'conditions',
        'action_config',
        'is_active',
        'priority',
        'execution_count',
        'last_executed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'conditions' => 'array',
        'action_config' => 'array',
        'is_active' => 'boolean',
        'last_executed_at' => 'datetime',
    ];
}
