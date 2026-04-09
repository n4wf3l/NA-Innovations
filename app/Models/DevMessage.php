<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DevMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'sender_id',
        'recipient_role',
        'content',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
