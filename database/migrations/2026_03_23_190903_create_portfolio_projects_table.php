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
        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('client_name');
            $table->string('client_logo')->nullable();
            $table->text('excerpt')->nullable();
            $table->text('context')->nullable();
            $table->text('challenge')->nullable();
            $table->text('solution')->nullable();
            $table->json('features')->nullable();
            $table->json('tech_stack')->nullable();
            $table->text('results')->nullable();
            $table->json('metrics')->nullable();
            $table->text('testimonial_text')->nullable();
            $table->string('testimonial_author')->nullable();
            $table->string('testimonial_role')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('live_url')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->date('completion_date')->nullable();
            $table->integer('duration_days')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_projects');
    }
};
