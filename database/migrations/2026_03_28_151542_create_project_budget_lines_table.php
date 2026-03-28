<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_budget_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
            $table->string('label');
            $table->string('type'); // income, expense
            $table->decimal('amount', 10, 2);
            $table->string('frequency'); // one_time, monthly, quarterly, annual
            $table->string('trigger'); // immediate, from_date, on_project_completed
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_confirmed')->default(false);
            $table->text('notes')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_budget_lines');
    }
};
