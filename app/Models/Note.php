<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Note extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'notable_id',
        'notable_type',
        'user_id',
        'content',
        'is_private',
        'is_pinned',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_private' => 'boolean',
        'is_pinned' => 'boolean',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function notable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
