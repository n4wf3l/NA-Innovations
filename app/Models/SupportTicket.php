<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportTicket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'project_id',
        'subject',
        'message',
        'status',
        'priority',
        'admin_reply',
        'replied_at',
        'replied_by',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function repliedBy()
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    public function replier()
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    public function messages()
    {
        return $this->hasMany(SupportMessage::class, 'ticket_id');
    }
}
