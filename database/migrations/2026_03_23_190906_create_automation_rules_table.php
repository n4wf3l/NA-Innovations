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
        Schema::create('automation_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('event');
            $table->string('action');
            $table->json('conditions')->nullable();
            $table->json('action_config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->integer('execution_count')->default(0);
            $table->timestamp('last_executed_at')->nullable();
            $table->timestamps();

            $table->index('event');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('automation_rules');
    }
};
