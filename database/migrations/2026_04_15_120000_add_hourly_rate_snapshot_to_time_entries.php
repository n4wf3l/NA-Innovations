<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_entries', function (Blueprint $table) {
            $table->decimal('hourly_rate_snapshot', 8, 2)->nullable()->after('hours');
        });
    }

    public function down(): void
    {
        Schema::table('time_entries', function (Blueprint $table) {
            $table->dropColumn('hourly_rate_snapshot');
        });
    }
};
