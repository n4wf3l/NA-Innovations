<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notifications_log';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'action_url',
        'data',
        'channel',
        'is_read',
        'read_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
