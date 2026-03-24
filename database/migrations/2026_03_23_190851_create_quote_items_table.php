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
        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->string('section')->nullable();
            $table->string('description');
            $table->text('details')->nullable();
            $table->decimal('quantity', 8, 2)->default(1);
            $table->string('unit')->default('unit');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total', 10, 2);
            $table->boolean('is_optional')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('quote_id');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_items');
    }
};
