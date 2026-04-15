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
        'hourly_rate_snapshot',
        'description',
        'task_category',
        'is_billable',
        'approval_status',
        'approved_at',
        'approved_by',
        'rejection_reason',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'decimal:2',
        'hourly_rate_snapshot' => 'decimal:2',
        'is_billable' => 'boolean',
        'approved_at' => 'datetime',
    ];

    protected $appends = ['cost'];

    public function getCostAttribute(): ?float
    {
        if ($this->hourly_rate_snapshot === null) {
            return null;
        }
        return round((float) $this->hours * (float) $this->hourly_rate_snapshot, 2);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

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
