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
        Schema::create('referral_partners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('referral_code', 20)->unique();
            $table->string('referral_link')->nullable();
            $table->decimal('default_commission_rate', 5, 2)->default(10.00);
            $table->enum('payment_method', ['bank_transfer', 'paypal', 'cash', 'other'])->default('bank_transfer');
            $table->string('bank_iban', 34)->nullable();
            $table->string('bank_bic', 11)->nullable();
            $table->string('paypal_email')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['referral_code', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referral_partners');
    }
};
