<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimelineEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'timelineable_id',
        'timelineable_type',
        'user_id',
        'event_type',
        'title',
        'description',
        'old_value',
        'new_value',
        'metadata',
        'icon',
        'color',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function timelineable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
