<?php

namespace App\Models;

use App\Models\Scopes\ClientAdminTenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Commission extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::addGlobalScope(new ClientAdminTenantScope());
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'referral_partner_id',
        'lead_id',
        'client_id',
        'projet_id',
        'invoice_id',
        'base_amount',
        'commission_rate',
        'commission_amount',
        'status',
        'scheduled_payment_date',
        'paid_date',
        'payment_reference',
        'notes',
        'blocked_reason',
        'blocked_at',
        'blocked_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'scheduled_payment_date' => 'date',
        'paid_date' => 'date',
        'blocked_at' => 'datetime',
    ];

    public function blockedBy()
    {
        return $this->belongsTo(User::class, 'blocked_by');
    }

    public function referralPartner()
    {
        return $this->belongsTo(ReferralPartner::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
