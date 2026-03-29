<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDoc extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'author_id',
        'title',
        'content',
        'category',
        'is_client_visible',
        'sort_order',
    ];

    protected $casts = [
        'is_client_visible' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
