<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_simulations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name')->nullable();
            $table->decimal('monthly_price', 10, 2);
            $table->json('client_growth');
            $table->json('team_members');
            $table->decimal('infra_cost_monthly', 10, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(0);
            $table->integer('time_horizon')->default(12);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_simulations');
    }
};
