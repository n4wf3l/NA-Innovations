<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
            $table->foreignId('document_template_id')->nullable()->constrained('document_templates')->nullOnDelete();
            $table->string('title', 255);
            $table->longText('content');
            $table->string('status')->default('draft');
            $table->string('pdf_path')->nullable();
            $table->string('locale')->default('fr');

            // Signature administrateur
            $table->foreignId('admin_signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->longText('admin_signature_data')->nullable();
            $table->timestamp('admin_signed_at')->nullable();

            // Signature client
            $table->foreignId('client_signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->longText('client_signature_data')->nullable();
            $table->timestamp('client_signed_at')->nullable();

            $table->text('rejection_reason')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_documents');
    }
};
