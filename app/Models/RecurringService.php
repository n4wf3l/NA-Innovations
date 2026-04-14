<?php

namespace App\Models;

use App\Models\Scopes\ClientAdminTenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringService extends Model
{
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::addGlobalScope(new ClientAdminTenantScope());
    }

    protected $fillable = [
        'client_id',
        'projet_id',
        'type',
        'name',
        'description',
        'provider',
        'provider_account',
        'provider_reference',
        'purchase_date',
        'expiry_date',
        'frequency',
        'real_cost',
        'billed_price',
        'margin',
        'currency',
        'status',
        'payment_mode',
        'auto_renew',
        'alert_days_before',
        'login_url',
        'credentials_note',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'real_cost' => 'decimal:2',
        'billed_price' => 'decimal:2',
        'margin' => 'decimal:2',
        'purchase_date' => 'date',
        'expiry_date' => 'date',
        'auto_renew' => 'boolean',
    ];

    // ──────────────────────────────────────────────
    // Boot
    // ──────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::saving(function (RecurringService $model) {
            $model->margin = $model->billed_price - $model->real_cost;
        });
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    public function renewals()
    {
        return $this->hasMany(ServiceRenewal::class, 'recurring_service_id');
    }

    public function timelineEvents()
    {
        return $this->morphMany(TimelineEvent::class, 'timelineable');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'notable');
    }
}
