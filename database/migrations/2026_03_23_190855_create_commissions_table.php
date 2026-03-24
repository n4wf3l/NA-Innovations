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
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referral_partner_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('base_amount', 10, 2);
            $table->decimal('commission_rate', 5, 2);
            $table->decimal('commission_amount', 10, 2);
            $table->enum('status', ['estimated', 'confirmed', 'scheduled', 'paid', 'cancelled'])->default('estimated');
            $table->date('scheduled_payment_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('referral_partner_id');
            $table->index('status');
            $table->index('lead_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
