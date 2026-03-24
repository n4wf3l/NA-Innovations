<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRenewal extends Model
{
    use HasFactory;

    protected $fillable = [
        'recurring_service_id',
        'renewal_date',
        'new_expiry_date',
        'cost',
        'billed_amount',
        'invoice_id',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'cost' => 'decimal:2',
        'billed_amount' => 'decimal:2',
        'renewal_date' => 'date',
        'new_expiry_date' => 'date',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function recurringService()
    {
        return $this->belongsTo(RecurringService::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
