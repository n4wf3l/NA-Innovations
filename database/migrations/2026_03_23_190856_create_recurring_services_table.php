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
        Schema::create('recurring_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->enum('type', ['hosting', 'domain', 'maintenance', 'email', 'ssl', 'other'])->default('other');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('provider')->nullable();
            $table->string('provider_account')->nullable();
            $table->string('provider_reference')->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('expiry_date');
            $table->enum('frequency', ['monthly', 'quarterly', 'semi_annual', 'annual', 'biennial', 'triennial'])->default('annual');
            $table->decimal('real_cost', 10, 2)->default(0);
            $table->decimal('billed_price', 10, 2)->default(0);
            $table->decimal('margin', 10, 2)->default(0);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['active', 'expiring_soon', 'expired', 'cancelled', 'suspended'])->default('active');
            $table->enum('payment_mode', ['included_in_project', 'billed_separately', 'admin_absorbs'])->default('billed_separately');
            $table->boolean('auto_renew')->default(true);
            $table->integer('alert_days_before')->default(30);
            $table->text('login_url')->nullable();
            $table->text('credentials_note')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('client_id');
            $table->index('projet_id');
            $table->index('type');
            $table->index('status');
            $table->index('expiry_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_services');
    }
};
