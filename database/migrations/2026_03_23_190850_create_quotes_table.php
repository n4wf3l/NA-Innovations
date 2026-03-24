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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number', 20)->unique();
            $table->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_company')->nullable();
            $table->text('client_address')->nullable();
            $table->string('client_vat', 30)->nullable();
            $table->string('title');
            $table->text('introduction')->nullable();
            $table->text('scope_of_work')->nullable();
            $table->text('exclusions')->nullable();
            $table->text('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(21.00);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'])->default('draft');
            $table->string('view_token', 64)->nullable()->unique();
            $table->date('valid_until')->nullable();
            $table->date('issue_date');
            $table->integer('deposit_percentage')->default(30);
            $table->decimal('deposit_amount', 10, 2)->default(0);
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('quote_number');
            $table->index('status');
            $table->index('client_id');
            $table->index('lead_id');
            $table->index('view_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
