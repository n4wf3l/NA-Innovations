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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->string('tagline', 500)->nullable();
            $table->longText('description')->nullable();
            $table->json('features')->nullable();
            $table->json('tech_stack')->nullable();
            $table->decimal('pricing_monthly', 8, 2)->nullable();
            $table->decimal('pricing_yearly', 8, 2)->nullable();
            $table->boolean('pricing_custom')->default(false);
            $table->string('status')->default('in_development');
            $table->string('live_url', 500)->nullable();
            $table->string('demo_url', 500)->nullable();
            $table->string('logo_path')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('target_audience', 500)->nullable();
            $table->foreignId('project_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->date('launched_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
