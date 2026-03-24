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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('company_name')->nullable();
            $table->string('vat_number', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->default('Belgium');
            $table->enum('status', ['new', 'contacted', 'brief_pending', 'brief_completed', 'call_scheduled', 'qualified', 'not_qualified', 'quote_draft', 'quote_sent', 'won', 'lost'])->default('new');
            $table->enum('source', ['referral', 'organic', 'website_contact', 'social_media', 'word_of_mouth', 'advertising', 'other'])->default('organic');
            $table->foreignId('referral_partner_id')->nullable()->constrained('referral_partners')->nullOnDelete();
            $table->foreignId('converted_client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('service_interest')->nullable();
            $table->decimal('estimated_budget', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('lost_reason')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->timestamp('qualified_at')->nullable();
            $table->timestamp('won_at')->nullable();
            $table->timestamp('lost_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('source');
            $table->index('referral_partner_id');
            $table->index('converted_client_id');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
