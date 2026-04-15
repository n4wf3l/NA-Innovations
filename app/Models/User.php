<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Scopes\UserAdminTenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected static function booted(): void
    {
        static::addGlobalScope(new UserAdminTenantScope());
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'company_name',
        'vat_number',
        'address',
        'city',
        'postal_code',
        'country',
        'avatar',
        'locale',
        'is_active',
        'last_login_at',
        'approved_at',
        'role',
        'preferences',
        'financial_pin',
        'signature',
        'github_token',
        'github_username',
        'hourly_rate',
        'deliverables_checklist_enabled',
        'skills',
        'specialties',
        'bio',
        'admin_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'financial_pin',
        'signature',
        'github_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
        'approved_at' => 'datetime',
        'preferences' => 'array',
        'github_token' => 'encrypted',
        'skills' => 'array',
        'specialties' => 'array',
        'hourly_rate' => 'decimal:2',
        'deliverables_checklist_enabled' => 'boolean',
        'two_factor_enabled' => 'boolean',
        'two_factor_secret' => 'encrypted',
        'two_factor_recovery_codes' => 'encrypted:array',
        'two_factor_confirmed_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Role helpers
    // ──────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isReferralPartner(): bool
    {
        return $this->role === 'referral_partner';
    }

    public function isDeveloper(): bool
    {
        return $this->role === 'developer';
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function referralPartner()
    {
        return $this->hasOne(ReferralPartner::class);
    }

    public function projects()
    {
        return $this->hasMany(Projet::class, 'client_id');
    }

    public function assignedProjects()
    {
        return $this->hasMany(Projet::class, 'developer_id');
    }

    public function clientProjects()
    {
        return $this->hasMany(Projet::class, 'client_id');
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'converted_client_id');
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class, 'client_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'client_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'client_id');
    }

    public function briefs()
    {
        return $this->hasMany(Brief::class, 'client_id');
    }

    public function recurringServices()
    {
        return $this->hasMany(RecurringService::class, 'client_id');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'notable');
    }

    // ──────────────────────────────────────────────
    // Multi-tenant relations
    // ──────────────────────────────────────────────

    public function owningAdmin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function tenantUsers()
    {
        return $this->hasMany(User::class, 'admin_id');
    }

    public function ownedProjets()
    {
        return $this->belongsToMany(Projet::class, 'projet_admins', 'user_id', 'projet_id')
            ->withPivot('role')
            ->withTimestamps();
    }
}
