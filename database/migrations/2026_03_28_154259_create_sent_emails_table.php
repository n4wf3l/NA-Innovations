<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sent_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('emailable_type');
            $table->unsignedBigInteger('emailable_id');
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject', 500);
            $table->longText('body');
            $table->string('template_slug')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('sent');
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['emailable_type', 'emailable_id']);
            $table->index('recipient_email');
            $table->index('sent_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sent_emails');
    }
};
