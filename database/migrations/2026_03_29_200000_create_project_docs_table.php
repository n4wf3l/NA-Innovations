<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_docs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title', 255);
            $table->longText('content');
            $table->string('category')->nullable();
            $table->boolean('is_client_visible')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_docs');
    }
};
