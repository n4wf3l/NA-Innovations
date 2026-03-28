<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectBudgetLine extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id', 'label', 'type', 'amount', 'frequency',
        'trigger', 'start_date', 'end_date', 'is_confirmed',
        'notes', 'sort_order',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'is_confirmed' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }
}
