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
            $table->foreignId('client_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->enum('status', ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'])->default('planning')->after('image');
            $table->text('description')->nullable()->after('status');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('deadline')->nullable();
            $table->decimal('budget', 10, 2)->nullable();
            $table->decimal('total_billed', 10, 2)->default(0);
            $table->boolean('is_portfolio')->default(false);
            $table->softDeletes();

            $table->index(['status', 'client_id', 'is_portfolio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projets', function (Blueprint $table) {
            $table->dropIndex(['status', 'client_id', 'is_portfolio']);
            $table->dropForeign(['client_id']);
            $table->dropSoftDeletes();
            $table->dropColumn([
                'client_id',
                'status',
                'description',
                'start_date',
                'end_date',
                'deadline',
                'budget',
                'total_billed',
                'is_portfolio',
            ]);
        });
    }
};
