<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('testimonials')) {
            return;
        }

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('message');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('status', 20)->default('pending');
            $table->boolean('show_on_landing')->default(false);
            $table->timestamps();

            $table->index(['status', 'show_on_landing']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
