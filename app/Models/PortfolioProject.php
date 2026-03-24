<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class PortfolioProject extends Model
{
    use HasFactory, HasSlug, SoftDeletes;

    protected $fillable = [
        'projet_id',
        'title',
        'slug',
        'client_name',
        'client_logo',
        'excerpt',
        'context',
        'challenge',
        'solution',
        'features',
        'tech_stack',
        'results',
        'metrics',
        'testimonial_text',
        'testimonial_author',
        'testimonial_role',
        'featured_image',
        'live_url',
        'category',
        'tags',
        'completion_date',
        'duration_days',
        'is_published',
        'is_featured',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'features' => 'array',
        'tech_stack' => 'array',
        'metrics' => 'array',
        'tags' => 'array',
        'completion_date' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function images()
    {
        return $this->hasMany(PortfolioImage::class);
    }
}
