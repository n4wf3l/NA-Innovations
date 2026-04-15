<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectDeliverable extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'is_completed',
        'completed_at',
        'completed_by',
        'created_by',
        'sort_order',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function completer()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
