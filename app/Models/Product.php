<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'tagline',
        'description',
        'features',
        'tech_stack',
        'pricing_monthly',
        'pricing_yearly',
        'pricing_custom',
        'status',
        'live_url',
        'demo_url',
        'video_url',
        'show_video',
        'logo_path',
        'cover_image_path',
        'target_audience',
        'project_id',
        'is_published',
        'is_featured',
        'sort_order',
        'launched_at',
    ];

    protected $casts = [
        'features' => 'array',
        'tech_stack' => 'array',
        'pricing_monthly' => 'decimal:2',
        'pricing_yearly' => 'decimal:2',
        'pricing_custom' => 'boolean',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'show_video' => 'boolean',
        'launched_at' => 'date',
    ];

    // ──────────────────────────────────────────────
    // Auto-generate slug from name
    // ──────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);

                // Ensure uniqueness
                $original = $product->slug;
                $count = 1;
                while (static::withTrashed()->where('slug', $product->slug)->exists()) {
                    $product->slug = $original . '-' . $count++;
                }
            }
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('name') && !$product->isDirty('slug')) {
                $product->slug = Str::slug($product->name);

                $original = $product->slug;
                $count = 1;
                while (static::withTrashed()->where('slug', $product->slug)->where('id', '!=', $product->id)->exists()) {
                    $product->slug = $original . '-' . $count++;
                }
            }
        });
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }
}
