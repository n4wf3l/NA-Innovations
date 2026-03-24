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
        Schema::table('projets', function (Blueprint $table) {
            $table->foreignId('developer_id')->nullable()->after('client_id')->constrained('users')->nullOnDelete();
            $table->foreignId('lead_id')->nullable()->after('developer_id')->constrained('leads')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->dropForeign(['developer_id']);
            $table->dropForeign(['lead_id']);
            $table->dropColumn(['developer_id', 'lead_id']);
        });
    }
};
