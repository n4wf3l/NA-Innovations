<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use App\Services\InvoiceService;
use App\Services\NumberGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class InvoiceTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        Setting::create(['group' => 'invoice', 'key' => 'invoice.prefix', 'value' => 'INV', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.default_tax_rate', 'value' => '21', 'type' => 'string']);
    }

    /** @test */
    public function admin_can_create_invoice()
    {
        $response = $this->actingAs($this->admin)->post('/admin/invoices', [
            'title' => 'Test Invoice',
            'client_name' => 'Jane',
            'client_email' => 'jane@test.com',
            'tax_rate' => 21,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'items' => [
                ['description' => 'Service', 'quantity' => 1, 'unit_price' => 2000],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('invoices', ['title' => 'Test Invoice', 'status' => 'draft']);
    }

    /** @test */
    public function payment_updates_invoice_status_to_paid()
    {
        $invoice = Invoice::create([
            'invoice_number' => 'INV-TEST-001',
            'title' => 'Payment Test',
            'client_name' => 'Test',
            'client_email' => 'payment-test@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'subtotal' => 1000,
            'tax_rate' => 21,
            'tax_amount' => 210,
            'total' => 1210,
            'amount_due' => 1210,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        InvoiceService::recordPayment($invoice, [
            'amount' => 1210,
            'method' => 'bank_transfer',
            'payment_date' => now()->toDateString(),
        ]);

        $invoice->refresh();
        $this->assertEquals('paid', $invoice->status);
        $this->assertEquals(0, $invoice->amount_due);
        $this->assertEquals(1210, $invoice->amount_paid);
    }

    /** @test */
    public function partial_payment_sets_partially_paid()
    {
        $invoice = Invoice::create([
            'invoice_number' => 'INV-PART-001',
            'title' => 'Partial Test',
            'client_name' => 'Test',
            'client_email' => 'partial-test@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'subtotal' => 1000,
            'tax_rate' => 21,
            'tax_amount' => 210,
            'total' => 1210,
            'amount_due' => 1210,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        InvoiceService::recordPayment($invoice, [
            'amount' => 500,
            'method' => 'bank_transfer',
            'payment_date' => now()->toDateString(),
        ]);

        $invoice->refresh();
        $this->assertEquals('partially_paid', $invoice->status);
        $this->assertEquals(710, $invoice->amount_due);
    }

    /** @test */
    public function only_draft_invoices_can_be_deleted()
    {
        $draftInvoice = Invoice::create([
            'invoice_number' => 'INV-DEL-001',
            'title' => 'Draft',
            'client_name' => 'Test',
            'client_email' => 'draft-del@test.com',
            'status' => 'draft',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 121,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        $sentInvoice = Invoice::create([
            'invoice_number' => 'INV-DEL-002',
            'title' => 'Sent',
            'client_name' => 'Test',
            'client_email' => 'sent-del@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 121,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        // Draft invoice can be deleted
        $this->actingAs($this->admin)
            ->delete("/admin/invoices/{$draftInvoice->id}")
            ->assertRedirect();
        $this->assertSoftDeleted('invoices', ['id' => $draftInvoice->id]);

        // Sent invoice cannot be deleted (controller guards against non-draft)
        $this->actingAs($this->admin)
            ->delete("/admin/invoices/{$sentInvoice->id}");
        $this->assertDatabaseHas('invoices', ['id' => $sentInvoice->id, 'deleted_at' => null]);
    }

    /** @test */
    public function payment_is_capped_at_amount_due()
    {
        $invoice = Invoice::create([
            'invoice_number' => 'INV-CAP-001',
            'title' => 'Cap Test',
            'client_name' => 'Test',
            'client_email' => 'cap-test@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 121,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        // Try to overpay
        $payment = InvoiceService::recordPayment($invoice, [
            'amount' => 500,
            'method' => 'bank_transfer',
            'payment_date' => now()->toDateString(),
        ]);

        // Payment should be capped at amount_due (121)
        $this->assertEquals(121, $payment->amount);

        $invoice->refresh();
        $this->assertEquals('paid', $invoice->status);
        $this->assertEquals(0, $invoice->amount_due);
    }

    /** @test */
    public function invoice_number_auto_increments()
    {
        $invoice1 = Invoice::create([
            'invoice_number' => NumberGenerator::generateInvoiceNumber(),
            'title' => 'Invoice 1',
            'client_name' => 'Test',
            'client_email' => 'inv1@test.com',
            'status' => 'draft',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 121,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        $invoice2 = Invoice::create([
            'invoice_number' => NumberGenerator::generateInvoiceNumber(),
            'title' => 'Invoice 2',
            'client_name' => 'Test',
            'client_email' => 'inv2@test.com',
            'status' => 'draft',
            'type' => 'standalone',
            'subtotal' => 200,
            'tax_rate' => 21,
            'tax_amount' => 42,
            'total' => 242,
            'amount_due' => 242,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => Str::random(64), 'currency' => 'EUR',
        ]);

        $this->assertNotEquals($invoice1->invoice_number, $invoice2->invoice_number);
        $this->assertStringStartsWith('INV-', $invoice1->invoice_number);
        $this->assertStringStartsWith('INV-', $invoice2->invoice_number);
    }
}
