<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'date',
        'hours',
        'description',
        'task_category',
        'is_billable',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'decimal:2',
        'is_billable' => 'boolean',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
