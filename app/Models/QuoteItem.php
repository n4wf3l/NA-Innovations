<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'quote_id',
        'section',
        'description',
        'details',
        'quantity',
        'unit',
        'unit_price',
        'total',
        'is_optional',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
        'is_optional' => 'boolean',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
