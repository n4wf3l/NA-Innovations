<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SentEmail extends Model
{
    protected $fillable = [
        'user_id', 'emailable_type', 'emailable_id', 'recipient_email',
        'recipient_name', 'subject', 'body', 'template_slug',
        'attachment_path', 'status', 'sent_at', 'error_message', 'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'sent_at' => 'datetime',
    ];

    public function emailable()
    {
        return $this->morphTo();
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
