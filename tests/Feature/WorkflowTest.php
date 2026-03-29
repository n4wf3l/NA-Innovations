<?php

namespace Tests\Feature;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Projet;
use App\Models\Quote;
use App\Models\ReferralPartner;
use App\Models\Setting;
use App\Models\User;
use App\Services\CommissionService;
use App\Services\InvoiceService;
use App\Services\PdfService;
use App\Services\QuoteService;
use App\Services\WorkflowService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $partnerUser;
    protected ReferralPartner $partner;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed required settings
        Setting::create(['group' => 'quote', 'key' => 'quote.prefix', 'value' => 'QT', 'type' => 'string']);
        Setting::create(['group' => 'quote', 'key' => 'quote.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.prefix', 'value' => 'INV', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.default_tax_rate', 'value' => '21', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.payment_terms_days', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_deposit_percentage', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_validity_days', 'value' => '30', 'type' => 'integer']);

        $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $this->partnerUser = User::factory()->create(['role' => 'referral_partner', 'is_active' => true]);
        $this->partner = ReferralPartner::create([
            'user_id' => $this->partnerUser->id,
            'referral_code' => 'TEST123',
            'default_commission_rate' => 10,
            'payment_method' => 'bank_transfer',
            'is_active' => true,
        ]);
    }

    /**
     * No-op for PDF generation. PdfService methods are wrapped in try/catch
     * in the workflow, so they won't crash the tests even without views.
     */
    protected function mockPdfGeneration(): void
    {
        // Nothing to mock — PdfService calls are non-critical in tests
        // and wrapped in try/catch in WorkflowService
    }

    /** @test */
    public function complete_workflow_from_lead_to_commission()
    {
        // PDF generation wrapped in try/catch — no mock needed

        // 1. Create lead with referral partner
        $lead = Lead::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@test.com',
            'status' => 'new',
            'source' => 'referral',
            'referral_partner_id' => $this->partner->id,
        ]);

        $this->assertEquals('new', $lead->status);
        $this->assertEquals($this->partner->id, $lead->referral_partner_id);

        // 2. Create quote linked to lead
        $quote = QuoteService::create([
            'title' => 'Test Project',
            'client_name' => 'John Doe',
            'client_email' => 'john@test.com',
            'lead_id' => $lead->id,
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Development', 'quantity' => 1, 'unit_price' => 5000],
        ]);

        $this->assertEquals('draft', $quote->status);
        $this->assertGreaterThan(0, $quote->total);
        $this->assertGreaterThan(0, $quote->deposit_amount);

        // 3. Accept quote -- triggers full workflow
        $this->actingAs($this->admin);
        $actions = WorkflowService::onQuoteAccepted($quote);

        $this->assertContains('client_linked', $actions);
        $this->assertContains('lead_won', $actions);
        $this->assertContains('project_created', $actions);
        $this->assertContains('deposit_invoice_created', $actions);

        // Verify lead status changed
        $lead->refresh();
        $this->assertEquals('won', $lead->status);
        $this->assertNotNull($lead->converted_client_id);

        // Verify client was created
        $client = User::find($lead->converted_client_id);
        $this->assertNotNull($client);
        $this->assertEquals('client', $client->role);
        $this->assertEquals('john@test.com', $client->email);

        // Verify project was created
        $quote->refresh();
        $this->assertNotNull($quote->projet_id);
        $project = Projet::find($quote->projet_id);
        $this->assertEquals('planning', $project->status);

        // Verify deposit invoice was created
        $depositInvoice = Invoice::where('quote_id', $quote->id)->where('type', 'deposit')->first();
        $this->assertNotNull($depositInvoice);
        $this->assertEquals('draft', $depositInvoice->status);

        // 4. Record payment on deposit invoice
        $payment = InvoiceService::recordPayment($depositInvoice, [
            'amount' => $depositInvoice->total,
            'method' => 'bank_transfer',
            'payment_date' => now()->toDateString(),
        ]);

        $depositInvoice->refresh();
        $this->assertEquals('paid', $depositInvoice->status);

        // Verify project moved to in_progress
        $project->refresh();
        $this->assertEquals('in_progress', $project->status);

        // 5. Verify commission was created via CommissionService
        $commission = CommissionService::calculateForPayment($payment);
        $this->assertNotNull($commission);
        $this->assertEquals($this->partner->id, $commission->referral_partner_id);
        $this->assertEquals('estimated', $commission->status);
        $this->assertGreaterThan(0, $commission->commission_amount);
    }

    /** @test */
    public function quote_rejection_marks_lead_as_lost()
    {
        $lead = Lead::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@test.com',
            'status' => 'quote_sent',
            'source' => 'organic',
        ]);

        $quote = QuoteService::create([
            'title' => 'Rejected Project',
            'client_name' => 'Jane Doe',
            'client_email' => 'jane@test.com',
            'lead_id' => $lead->id,
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Dev', 'quantity' => 1, 'unit_price' => 3000],
        ]);

        $this->actingAs($this->admin);
        WorkflowService::onQuoteRejected($quote, 'Too expensive');

        $quote->refresh();
        $lead->refresh();
        $this->assertEquals('rejected', $quote->status);
        $this->assertEquals('lost', $lead->status);
        $this->assertEquals('Too expensive', $lead->lost_reason);
    }

    /** @test */
    public function final_invoice_deducts_deposit()
    {
        $quote = QuoteService::create([
            'title' => 'Deposit Test',
            'client_name' => 'Test',
            'client_email' => 'deposit-test@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Work', 'quantity' => 1, 'unit_price' => 10000],
        ]);

        // Create deposit invoice
        $depositInvoice = QuoteService::convertToInvoice($quote, 'deposit');
        $this->assertGreaterThan(0, $depositInvoice->total);

        // Create final invoice
        $finalInvoice = QuoteService::convertToInvoice($quote, 'final');

        // Final should be total minus deposit
        $this->assertLessThan($quote->total, $finalInvoice->total);
        $expectedFinal = $quote->total - $depositInvoice->total;
        $this->assertEquals(round($expectedFinal, 2), round($finalInvoice->total, 2));
    }

    /** @test */
    public function commission_uses_project_lead_lookup_path()
    {
        // Path via project -> lead
        $lead = Lead::create([
            'first_name' => 'Path',
            'last_name' => 'Test',
            'email' => 'path@test.com',
            'status' => 'won',
            'source' => 'referral',
            'referral_partner_id' => $this->partner->id,
        ]);

        $project = Projet::create([
            'nom_societe' => 'Commission Path Test',
            'status' => 'in_progress',
            'lead_id' => $lead->id,
        ]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-PATH-001',
            'title' => 'Test',
            'client_name' => 'Test',
            'client_email' => 'path@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'projet_id' => $project->id,
            'subtotal' => 1000,
            'tax_rate' => 21,
            'tax_amount' => 210,
            'total' => 1210,
            'amount_due' => 1210,
            'amount_paid' => 0,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'view_token' => \Illuminate\Support\Str::random(64),
        ]);

        $payment = $invoice->payments()->create([
            'amount' => 1210,
            'method' => 'bank_transfer',
            'payment_date' => now(),
            'status' => 'confirmed',
        ]);

        $commission = CommissionService::calculateForPayment($payment);

        $this->assertNotNull($commission);
        $this->assertEquals($lead->id, $commission->lead_id);
        $this->assertEquals($this->partner->id, $commission->referral_partner_id);
    }

    /** @test */
    public function double_quote_acceptance_is_prevented()
    {
        // PDF generation wrapped in try/catch — no mock needed

        $quote = QuoteService::create([
            'title' => 'Double Accept Test',
            'client_name' => 'Test',
            'client_email' => 'double-accept@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Work', 'quantity' => 1, 'unit_price' => 5000],
        ]);

        $this->actingAs($this->admin);

        // First acceptance
        $actions1 = WorkflowService::onQuoteAccepted($quote);
        $this->assertNotEmpty($actions1);

        // Second acceptance should return empty (guard)
        $quote->refresh();
        $actions2 = WorkflowService::onQuoteAccepted($quote);
        $this->assertEmpty($actions2);
    }
}
