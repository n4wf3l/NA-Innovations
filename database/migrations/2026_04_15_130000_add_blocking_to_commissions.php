<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->text('blocked_reason')->nullable()->after('notes');
            $table->timestamp('blocked_at')->nullable()->after('blocked_reason');
            $table->foreignId('blocked_by')->nullable()->after('blocked_at')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('blocked_by');
            $table->dropColumn(['blocked_reason', 'blocked_at']);
        });
    }
};
