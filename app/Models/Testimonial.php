<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'user_id', 'message', 'rating', 'status', 'show_on_landing',
    ];

    protected $casts = [
        'show_on_landing' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeOnLanding($query)
    {
        return $query->where('status', 'approved')->where('show_on_landing', true);
    }
}
