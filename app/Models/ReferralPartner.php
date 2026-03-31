<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReferralPartner extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'referral_code',
        'referral_link',
        'default_commission_rate',
        'payment_method',
        'bank_iban',
        'bank_bic',
        'paypal_email',
        'notes',
        'is_active',
        'kb_access_status',
        'kb_nda_signature',
        'kb_nda_full_name',
        'kb_nda_signed_at',
        'kb_nda_signed_ip',
        'kb_access_granted_at',
        'kb_access_granted_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'default_commission_rate' => 'decimal:2',
        'is_active' => 'boolean',
        'kb_nda_signed_at' => 'datetime',
        'kb_access_granted_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
}
