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
        Schema::create('portfolio_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->enum('type', ['screenshot', 'before', 'after', 'mockup', 'photo', 'other'])->default('screenshot');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('portfolio_project_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_images');
    }
};
