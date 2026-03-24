<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_project_id',
        'image_path',
        'alt_text',
        'caption',
        'type',
        'is_featured',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_featured' => 'boolean',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function portfolioProject()
    {
        return $this->belongsTo(PortfolioProject::class);
    }
}
