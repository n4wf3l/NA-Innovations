<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brief extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lead_id',
        'projet_id',
        'client_id',
        'token',
        'project_type',
        'project_description',
        'target_audience',
        'main_features',
        'design_preferences',
        'existing_website',
        'competitors',
        'content_ready',
        'budget_min',
        'budget_max',
        'desired_deadline',
        'additional_notes',
        'answers',
        'status',
        'sent_at',
        'completed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'answers' => 'array',
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'desired_deadline' => 'date',
        'sent_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
