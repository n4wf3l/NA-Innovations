<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentSignatureHistory extends Model
{
    use HasFactory;

    protected $table = 'document_signature_history';

    protected $fillable = [
        'project_document_id',
        'signer_role',
        'signer_user_id',
        'signature_data',
        'signature_hash',
        'signed_ip',
        'signed_at',
        'revoked_at',
        'revoked_by',
        'revocation_reason',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function projectDocument()
    {
        return $this->belongsTo(ProjectDocument::class);
    }

    public function signer()
    {
        return $this->belongsTo(User::class, 'signer_user_id');
    }

    public function revoker()
    {
        return $this->belongsTo(User::class, 'revoked_by');
    }
}
