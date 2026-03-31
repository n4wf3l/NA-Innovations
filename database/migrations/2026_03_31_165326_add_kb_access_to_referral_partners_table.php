<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('referral_partners', function (Blueprint $table) {
            $table->string('kb_access_status')->default('none')->after('is_active'); // none, pending, approved, rejected
            $table->longText('kb_nda_signature')->nullable()->after('kb_access_status');
            $table->string('kb_nda_full_name')->nullable()->after('kb_nda_signature');
            $table->timestamp('kb_nda_signed_at')->nullable()->after('kb_nda_full_name');
            $table->string('kb_nda_signed_ip', 45)->nullable()->after('kb_nda_signed_at');
            $table->timestamp('kb_access_granted_at')->nullable()->after('kb_nda_signed_ip');
            $table->foreignId('kb_access_granted_by')->nullable()->after('kb_access_granted_at')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('referral_partners', function (Blueprint $table) {
            $table->dropForeign(['kb_access_granted_by']);
            $table->dropColumn(['kb_access_status', 'kb_nda_signature', 'kb_nda_full_name', 'kb_nda_signed_at', 'kb_nda_signed_ip', 'kb_access_granted_at', 'kb_access_granted_by']);
        });
    }
};
