<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quote extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'quote_number',
        'lead_id',
        'client_id',
        'projet_id',
        'client_name',
        'client_email',
        'client_company',
        'client_address',
        'client_vat',
        'title',
        'introduction',
        'scope_of_work',
        'exclusions',
        'terms_and_conditions',
        'notes',
        'subtotal',
        'discount_amount',
        'discount_type',
        'discount_value',
        'tax_rate',
        'tax_amount',
        'total',
        'currency',
        'status',
        'view_token',
        'valid_until',
        'issue_date',
        'deposit_percentage',
        'deposit_amount',
        'sent_at',
        'viewed_at',
        'accepted_at',
        'rejected_at',
        'rejection_reason',
        'pdf_path',
        'locale',
        'include_signature',
        'signature_data',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'deposit_percentage' => 'integer',
        'valid_until' => 'date',
        'issue_date' => 'date',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'accepted_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

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

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
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
