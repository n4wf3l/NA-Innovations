<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerReminder extends Model
{
    protected $fillable = [
        'user_id', 'contact_name', 'contact_email', 'contact_phone',
        'company_name', 'notes', 'remind_at', 'send_email_notification',
        'status', 'sent_at', 'dismissed_at', 'lead_id',
    ];

    protected $casts = [
        'remind_at' => 'datetime',
        'sent_at' => 'datetime',
        'dismissed_at' => 'datetime',
        'send_email_notification' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDue($query)
    {
        return $query->pending()->where('remind_at', '<=', now());
    }
}
