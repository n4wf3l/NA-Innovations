<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectPayout extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'role',
        'amount',
        'status',
        'paid_date',
        'payment_method',
        'payment_reference',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_date' => 'date',
    ];

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
