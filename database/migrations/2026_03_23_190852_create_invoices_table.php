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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number', 20)->unique();
            $table->foreignId('quote_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_company')->nullable();
            $table->text('client_address')->nullable();
            $table->string('client_vat', 30)->nullable();
            $table->string('title');
            $table->text('notes')->nullable();
            $table->enum('type', ['deposit', 'final', 'standalone', 'credit_note'])->default('standalone');
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(21.00);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->decimal('amount_due', 10, 2)->default(0);
            $table->string('currency', 3)->default('EUR');
            $table->enum('status', ['draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded'])->default('draft');
            $table->date('issue_date');
            $table->date('due_date');
            $table->string('view_token', 64)->nullable()->unique();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('pdf_path')->nullable();
            $table->text('payment_instructions')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('invoice_number');
            $table->index('status');
            $table->index('client_id');
            $table->index('quote_id');
            $table->index('type');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
