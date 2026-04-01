<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerProspect extends Model
{
    protected $fillable = [
        'user_id', 'name', 'email', 'phone', 'company_name',
        'notes', 'status', 'follow_up_date', 'follow_up_notified',
        'send_email_reminder', 'lead_id',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
        'follow_up_notified' => 'boolean',
        'send_email_reminder' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeDueFollowUp($query)
    {
        return $query->whereNotNull('follow_up_date')
            ->where('follow_up_date', '<=', now()->toDateString())
            ->where('follow_up_notified', false)
            ->whereNotIn('status', ['soumis']);
    }
}
