<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'key',
        'value',
        'type',
        'description',
    ];

    // ──────────────────────────────────────────────
    // Static helpers
    // ──────────────────────────────────────────────

    /**
     * Get a setting value by key (cached).
     */
    public static function get(string $key, $default = null)
    {
        $settings = \Illuminate\Support\Facades\Cache::remember('app_settings', 300, function () {
            return static::pluck('value', 'key')->toArray();
        });

        return $settings[$key] ?? $default;
    }

    /**
     * Set a setting value by key (invalidates cache).
     */
    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        \Illuminate\Support\Facades\Cache::forget('app_settings');
    }
}
