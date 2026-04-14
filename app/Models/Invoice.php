<?php

namespace App\Models;

use App\Models\Scopes\ClientAdminTenantScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
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
        'invoice_number',
        'quote_id',
        'client_id',
        'projet_id',
        'client_name',
        'client_email',
        'client_company',
        'client_address',
        'client_vat',
        'title',
        'notes',
        'type',
        'subtotal',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'total',
        'amount_paid',
        'amount_due',
        'currency',
        'locale',
        'status',
        'issue_date',
        'due_date',
        'view_token',
        'sent_at',
        'viewed_at',
        'paid_at',
        'pdf_path',
        'payment_instructions',
        'is_external',
        'credit_note_for',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'amount_due' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'paid_at' => 'datetime',
        'is_external' => 'boolean',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
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
        return $this->hasMany(InvoiceItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }

    public function timelineEvents()
    {
        return $this->morphMany(TimelineEvent::class, 'timelineable');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function reminders()
    {
        return $this->hasMany(InvoiceReminder::class);
    }

    public function originalInvoice()
    {
        return $this->belongsTo(Invoice::class, 'credit_note_for');
    }

    public function creditNotes()
    {
        return $this->hasMany(Invoice::class, 'credit_note_for');
    }
}
