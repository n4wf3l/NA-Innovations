<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_documents', function (Blueprint $table) {
            $table->string('document_reference', 50)->nullable()->after('id');
            $table->timestamp('content_locked_at')->nullable()->after('content');
            $table->string('pdf_hash', 64)->nullable()->after('pdf_path');
            $table->string('admin_signed_ip', 45)->nullable()->after('admin_signed_at');
            $table->string('client_signed_ip', 45)->nullable()->after('client_signed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_documents', function (Blueprint $table) {
            $table->dropColumn([
                'document_reference',
                'content_locked_at',
                'pdf_hash',
                'admin_signed_ip',
                'client_signed_ip',
            ]);
        });
    }
};
