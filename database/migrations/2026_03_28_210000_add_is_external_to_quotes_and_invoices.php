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
        Schema::table('quotes', function (Blueprint $table) {
            $table->boolean('is_external')->default(false)->after('locale');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->boolean('is_external')->default(false)->after('locale');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn('is_external');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('is_external');
        });
    }
};
