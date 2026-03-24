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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('EUR');
            $table->enum('method', ['bank_transfer', 'cash', 'paypal', 'stripe', 'card', 'other'])->default('bank_transfer');
            $table->string('reference')->nullable();
            $table->text('notes')->nullable();
            $table->date('payment_date');
            $table->enum('status', ['pending', 'confirmed', 'failed', 'refunded'])->default('confirmed');
            $table->timestamps();

            $table->index('invoice_id');
            $table->index('client_id');
            $table->index('payment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
