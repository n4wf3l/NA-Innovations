<?php

namespace App\Models;

use App\Models\Scopes\AdminIdTenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::addGlobalScope(new AdminIdTenantScope());
    }

    protected $fillable = [
        'admin_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'company_name',
        'vat_number',
        'address',
        'city',
        'postal_code',
        'country',
        'status',
        'source',
        'referral_partner_id',
        'converted_client_id',
        'service_interest',
        'estimated_budget',
        'notes',
        'lost_reason',
        'contacted_at',
        'qualified_at',
        'won_at',
        'lost_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'estimated_budget' => 'decimal:2',
        'contacted_at' => 'datetime',
        'qualified_at' => 'datetime',
        'won_at' => 'datetime',
        'lost_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function referralPartner()
    {
        return $this->belongsTo(ReferralPartner::class);
    }

    public function convertedClient()
    {
        return $this->belongsTo(User::class, 'converted_client_id');
    }

    public function briefs()
    {
        return $this->hasMany(Brief::class);
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    public function timelineEvents()
    {
        return $this->morphMany(TimelineEvent::class, 'timelineable');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'notable');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
