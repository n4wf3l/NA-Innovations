<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\RecurringService;
use App\Services\WorkflowService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CronJobsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function overdue_invoices_are_marked()
    {
        Invoice::create([
            'invoice_number' => 'INV-OVERDUE-001',
            'title' => 'Overdue Test',
            'client_name' => 'Test',
            'client_email' => 'overdue@test.com',
            'status' => 'sent',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 121,
            'amount_paid' => 0,
            'issue_date' => now()->subDays(40),
            'due_date' => now()->subDays(10),
            'view_token' => Str::random(64),
        ]);

        $count = WorkflowService::checkOverdueInvoices();

        $this->assertEquals(1, $count);
        $this->assertDatabaseHas('invoices', [
            'invoice_number' => 'INV-OVERDUE-001',
            'status' => 'overdue',
        ]);
    }

    /** @test */
    public function non_overdue_invoices_are_not_marked()
    {
        Invoice::create([
            'invoice_number' => 'INV-OK-001',
            'title' => 'Not Overdue',
            'client_name' => 'Test',
            'client_email' => 'not-overdue@test.com',
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
            'view_token' => Str::random(64),
        ]);

        $count = WorkflowService::checkOverdueInvoices();

        $this->assertEquals(0, $count);
        $this->assertDatabaseHas('invoices', [
            'invoice_number' => 'INV-OK-001',
            'status' => 'sent',
        ]);
    }

    /** @test */
    public function paid_invoices_are_not_marked_overdue()
    {
        Invoice::create([
            'invoice_number' => 'INV-PAID-001',
            'title' => 'Paid Invoice',
            'client_name' => 'Test',
            'client_email' => 'paid@test.com',
            'status' => 'paid',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 0,
            'amount_paid' => 121,
            'issue_date' => now()->subDays(40),
            'due_date' => now()->subDays(10),
            'view_token' => Str::random(64),
        ]);

        $count = WorkflowService::checkOverdueInvoices();

        $this->assertEquals(0, $count);
        $this->assertDatabaseHas('invoices', [
            'invoice_number' => 'INV-PAID-001',
            'status' => 'paid',
        ]);
    }

    /** @test */
    public function partially_paid_overdue_invoices_are_marked()
    {
        Invoice::create([
            'invoice_number' => 'INV-PP-OD-001',
            'title' => 'Partially Paid Overdue',
            'client_name' => 'Test',
            'client_email' => 'pp-overdue@test.com',
            'status' => 'partially_paid',
            'type' => 'standalone',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'amount_due' => 60,
            'amount_paid' => 61,
            'issue_date' => now()->subDays(40),
            'due_date' => now()->subDays(10),
            'view_token' => Str::random(64),
        ]);

        $count = WorkflowService::checkOverdueInvoices();

        $this->assertEquals(1, $count);
        $this->assertDatabaseHas('invoices', [
            'invoice_number' => 'INV-PP-OD-001',
            'status' => 'overdue',
        ]);
    }

    /** @test */
    public function auto_renew_extends_expiry_date()
    {
        $service = RecurringService::create([
            'name' => 'Test Hosting',
            'type' => 'hosting',
            'provider' => 'Test',
            'expiry_date' => now()->subDays(1),
            'frequency' => 'annual',
            'real_cost' => 50,
            'billed_price' => 100,
            'status' => 'active',
            'auto_renew' => true,
            'alert_days_before' => 30,
        ]);

        WorkflowService::autoRenewServices();

        $service->refresh();
        $this->assertTrue($service->expiry_date->isFuture());
        $this->assertEquals('active', $service->status);
    }

    /** @test */
    public function non_auto_renew_services_expire()
    {
        $service = RecurringService::create([
            'name' => 'Manual Hosting',
            'type' => 'hosting',
            'provider' => 'Test',
            'expiry_date' => now()->subDays(1),
            'frequency' => 'annual',
            'real_cost' => 50,
            'billed_price' => 100,
            'status' => 'active',
            'auto_renew' => false,
            'alert_days_before' => 30,
        ]);

        WorkflowService::autoRenewServices();

        $service->refresh();
        $this->assertEquals('expired', $service->status);
    }
}
