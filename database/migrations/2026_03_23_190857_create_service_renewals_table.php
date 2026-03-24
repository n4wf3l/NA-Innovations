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
        Schema::create('service_renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recurring_service_id')->constrained()->cascadeOnDelete();
            $table->date('renewal_date');
            $table->date('new_expiry_date');
            $table->decimal('cost', 10, 2);
            $table->decimal('billed_amount', 10, 2);
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['pending', 'completed', 'failed', 'skipped'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('recurring_service_id');
            $table->index('renewal_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_renewals');
    }
};
