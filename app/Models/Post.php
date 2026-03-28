<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'subject', 'description', 'content', 'excerpt',
        'photo', 'cover_image', 'category', 'tags', 'status',
        'published_at', 'author_id', 'reading_time',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    protected $appends = ['image_url'];

    /**
     * Auto-generate slug from title on creation.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = \Illuminate\Support\Str::slug($post->title);
                $original = $post->slug;
                $count = 1;
                while (self::where('slug', $post->slug)->exists()) {
                    $post->slug = "{$original}-{$count}";
                    $count++;
                }
            }
        });
    }

    /**
     * Calculate reading time based on content word count.
     */
    public function calculateReadingTime(): int
    {
        $text = strip_tags($this->content ?: $this->description);
        $wordCount = str_word_count($text);
        return max(1, (int) ceil($wordCount / 200));
    }

    /**
     * Author relationship.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope: only published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')->where('published_at', '<=', now());
    }

    /**
     * Get the display image URL (cover_image or photo fallback).
     */
    public function getImageUrlAttribute(): ?string
    {
        $img = $this->cover_image ?: $this->photo;
        if (!$img) return null;
        if (str_starts_with($img, 'http')) return $img;
        if (str_starts_with($img, 'public/')) return '/storage/' . str_replace('public/', '', $img);
        return '/storage/' . $img;
    }
}
