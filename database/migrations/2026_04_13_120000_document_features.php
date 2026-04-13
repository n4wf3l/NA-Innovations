<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Feature 2: Purchase Orders table ──
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('quote_id')->constrained('quotes')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('projet_id')->nullable()->constrained('projets')->nullOnDelete();
            $table->string('client_name');
            $table->string('client_email')->nullable();
            $table->string('client_company')->nullable();
            $table->text('client_address')->nullable();
            $table->string('client_vat')->nullable();
            $table->json('items');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(21);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('currency', 10)->default('EUR');
            $table->string('status')->default('draft'); // draft, confirmed, cancelled
            $table->date('issue_date')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('locale', 5)->default('fr');
            $table->timestamps();
        });

        // ── Feature 6: Credit note reference on invoices ──
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('credit_note_for')->nullable()->after('type')->constrained('invoices')->nullOnDelete();
        });

        // ── Feature 9: Signature hashing on project documents ──
        Schema::table('project_documents', function (Blueprint $table) {
            $table->string('admin_signature_hash')->nullable()->after('admin_signed_ip');
            $table->string('client_signature_hash')->nullable()->after('client_signed_ip');
        });
    }

    public function down(): void
    {
        Schema::table('project_documents', function (Blueprint $table) {
            $table->dropColumn(['admin_signature_hash', 'client_signature_hash']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['credit_note_for']);
            $table->dropColumn('credit_note_for');
        });

        Schema::dropIfExists('purchase_orders');
    }
};
