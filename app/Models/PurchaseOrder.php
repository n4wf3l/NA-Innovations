<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'po_number',
        'quote_id',
        'client_id',
        'projet_id',
        'client_name',
        'client_email',
        'client_company',
        'client_address',
        'client_vat',
        'items',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'total',
        'currency',
        'status',
        'issue_date',
        'pdf_path',
        'locale',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'issue_date' => 'date',
    ];

    // ──────────────────────────────────────────────
    // Boot — Auto-generate PO number
    // ──────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function (PurchaseOrder $po) {
            if (empty($po->po_number)) {
                $year = now()->format('Y');
                $count = self::whereYear('created_at', $year)->count() + 1;
                $po->po_number = "PO-{$year}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

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
}
