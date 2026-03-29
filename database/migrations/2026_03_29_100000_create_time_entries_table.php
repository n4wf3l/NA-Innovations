<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projets')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('date');
            $table->decimal('hours', 5, 2);
            $table->string('description', 500);
            $table->string('task_category')->nullable();
            $table->boolean('is_billable')->default(true);
            $table->timestamps();

            $table->index(['project_id', 'user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_entries');
    }
};
