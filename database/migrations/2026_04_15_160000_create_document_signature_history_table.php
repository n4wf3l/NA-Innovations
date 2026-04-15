<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_signature_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_document_id')->constrained('project_documents')->cascadeOnDelete();
            $table->enum('signer_role', ['admin', 'client']);
            $table->foreignId('signer_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->longText('signature_data');
            $table->string('signature_hash', 64);
            $table->string('signed_ip', 45)->nullable();
            $table->timestamp('signed_at');
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('revoked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('revocation_reason')->nullable();
            $table->timestamps();

            $table->index(['project_document_id', 'signer_role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_signature_history');
    }
};
