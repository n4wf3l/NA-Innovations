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
        Schema::create('briefs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('token', 64)->unique();
            $table->string('project_type')->nullable();
            $table->text('project_description')->nullable();
            $table->text('target_audience')->nullable();
            $table->text('main_features')->nullable();
            $table->text('design_preferences')->nullable();
            $table->string('existing_website')->nullable();
            $table->text('competitors')->nullable();
            $table->text('content_ready')->nullable();
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->date('desired_deadline')->nullable();
            $table->text('additional_notes')->nullable();
            $table->json('answers')->nullable();
            $table->enum('status', ['draft', 'sent', 'in_progress', 'completed'])->default('draft');
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['token', 'status', 'lead_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('briefs');
    }
};
