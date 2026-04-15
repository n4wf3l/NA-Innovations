<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_deliverables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['project_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_deliverables');
    }
};
