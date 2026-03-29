<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use App\Services\QuoteService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        Setting::create(['group' => 'quote', 'key' => 'quote.prefix', 'value' => 'QT', 'type' => 'string']);
        Setting::create(['group' => 'quote', 'key' => 'quote.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_validity_days', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_deposit_percentage', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.default_tax_rate', 'value' => '21', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.prefix', 'value' => 'INV', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.next_number', 'value' => '1', 'type' => 'integer']);
    }

    /** @test */
    public function admin_can_create_quote()
    {
        $response = $this->actingAs($this->admin)->post('/admin/quotes', [
            'title' => 'Test Quote',
            'client_name' => 'John Doe',
            'client_email' => 'john@example.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
            'items' => [
                ['description' => 'Web Development', 'quantity' => 1, 'unit_price' => 5000],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('quotes', ['title' => 'Test Quote', 'status' => 'draft']);
    }

    /** @test */
    public function quote_calculates_totals_correctly()
    {
        $quote = QuoteService::create([
            'title' => 'Calc Test',
            'client_name' => 'Test',
            'client_email' => 'calc-test@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Item 1', 'quantity' => 2, 'unit_price' => 1000],
            ['description' => 'Item 2', 'quantity' => 1, 'unit_price' => 500, 'is_optional' => true],
        ]);

        // Only non-optional items count
        $this->assertEquals(2000, $quote->subtotal);
        $this->assertEquals(420, $quote->tax_amount);       // 2000 * 21%
        $this->assertEquals(2420, $quote->total);            // 2000 + 420
        $this->assertEquals(726, $quote->deposit_amount);    // 2420 * 30%
    }

    /** @test */
    public function quote_cannot_be_created_without_items()
    {
        $response = $this->actingAs($this->admin)->post('/admin/quotes', [
            'title' => 'No Items',
            'client_name' => 'Test',
            'client_email' => 'noitems@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
            'items' => [],
        ]);

        $response->assertSessionHasErrors('items');
    }

    /** @test */
    public function quote_can_be_duplicated()
    {
        $quote = QuoteService::create([
            'title' => 'Original',
            'client_name' => 'Test',
            'client_email' => 'duplicate-test@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Item', 'quantity' => 1, 'unit_price' => 1000],
        ]);

        $duplicate = QuoteService::duplicate($quote);

        $this->assertNotEquals($quote->id, $duplicate->id);
        $this->assertNotEquals($quote->quote_number, $duplicate->quote_number);
        $this->assertEquals('draft', $duplicate->status);
        $this->assertEquals($quote->total, $duplicate->total);
        $this->assertEquals($quote->items->count(), $duplicate->items->count());
    }

    /** @test */
    public function quote_number_auto_increments()
    {
        $quote1 = QuoteService::create([
            'title' => 'Quote 1',
            'client_name' => 'Test',
            'client_email' => 'auto1@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Item', 'quantity' => 1, 'unit_price' => 1000],
        ]);

        $quote2 = QuoteService::create([
            'title' => 'Quote 2',
            'client_name' => 'Test',
            'client_email' => 'auto2@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Item', 'quantity' => 1, 'unit_price' => 2000],
        ]);

        $this->assertNotEquals($quote1->quote_number, $quote2->quote_number);
        $this->assertStringStartsWith('QT-', $quote1->quote_number);
        $this->assertStringStartsWith('QT-', $quote2->quote_number);
    }

    /** @test */
    public function quote_has_view_token()
    {
        $quote = QuoteService::create([
            'title' => 'Token Test',
            'client_name' => 'Test',
            'client_email' => 'token-test@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Item', 'quantity' => 1, 'unit_price' => 1000],
        ]);

        $this->assertNotNull($quote->view_token);
        $this->assertEquals(64, strlen($quote->view_token));
    }

    /** @test */
    public function quote_with_discount_calculates_correctly()
    {
        $quote = QuoteService::create([
            'title' => 'Discount Test',
            'client_name' => 'Test',
            'client_email' => 'discount@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
            'discount_type' => 'percentage',
            'discount_value' => 10,
        ], [
            ['description' => 'Item', 'quantity' => 1, 'unit_price' => 1000],
        ]);

        // 1000 - 10% = 900, tax = 900 * 0.21 = 189, total = 1089
        $this->assertEquals(1000, $quote->subtotal);
        $this->assertEquals(100, $quote->discount_amount);
        $this->assertEquals(189, $quote->tax_amount);
        $this->assertEquals(1089, $quote->total);
    }
}
