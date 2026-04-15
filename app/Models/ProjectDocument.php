<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'document_template_id',
        'document_reference',
        'title',
        'content',
        'content_locked_at',
        'status',
        'pdf_path',
        'pdf_hash',
        'locale',
        'admin_signed_by',
        'admin_signature_data',
        'admin_signed_at',
        'admin_signed_ip',
        'admin_signature_hash',
        'client_signed_by',
        'client_signature_data',
        'client_signed_at',
        'client_signed_ip',
        'client_signature_hash',
        'rejection_reason',
        'sent_at',
        'viewed_at',
        'notes',
    ];

    protected $casts = [
        'admin_signed_at' => 'datetime',
        'client_signed_at' => 'datetime',
        'content_locked_at' => 'datetime',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
    ];

    // ──────────────────────────────────────────────
    // Boot
    // ──────────────────────────────────────────────

    protected static function boot()
    {
        parent::boot();

        static::creating(function (ProjectDocument $doc) {
            $year = now()->format('Y');
            $count = self::whereYear('created_at', $year)->withTrashed()->count() + 1;
            $doc->document_reference = "DOC-{$year}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
        });
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    /**
     * Projet associé à ce document.
     */
    public function project()
    {
        return $this->belongsTo(Projet::class, 'project_id');
    }

    /**
     * Modèle de document utilisé.
     */
    public function template()
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }

    /**
     * Administrateur ayant signé le document.
     */
    public function adminSigner()
    {
        return $this->belongsTo(User::class, 'admin_signed_by');
    }

    /**
     * Client ayant signé le document.
     */
    public function clientSigner()
    {
        return $this->belongsTo(User::class, 'client_signed_by');
    }

    // ──────────────────────────────────────────────
    // Méthodes
    // ──────────────────────────────────────────────

    /**
     * Vérifie si le document est entièrement signé (admin et client).
     */
    public function isFullySigned(): bool
    {
        return $this->admin_signed_at !== null && $this->client_signed_at !== null;
    }

    /**
     * Vérifie si le contenu du document est verrouillé.
     */
    public function isContentLocked(): bool
    {
        return $this->content_locked_at !== null;
    }

    public function signatureHistory()
    {
        return $this->hasMany(DocumentSignatureHistory::class)->orderByDesc('signed_at');
    }
}
