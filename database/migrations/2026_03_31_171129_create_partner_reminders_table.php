<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('contact_name');
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('company_name')->nullable();
            $table->text('notes')->nullable();
            $table->dateTime('remind_at');
            $table->boolean('send_email_notification')->default(true);
            $table->string('status')->default('pending'); // pending, sent, dismissed
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('dismissed_at')->nullable();
            $table->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'status', 'remind_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_reminders');
    }
};
