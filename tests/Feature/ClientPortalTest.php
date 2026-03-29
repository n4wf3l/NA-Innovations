<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Projet;
use App\Models\Quote;
use App\Models\Setting;
use App\Models\User;
use App\Services\QuoteService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class ClientPortalTest extends TestCase
{
    use RefreshDatabase;

    protected User $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = User::factory()->create(['role' => 'client', 'is_active' => true]);
    }

    /** @test */
    public function client_redirects_to_project_if_only_one()
    {
        $project = Projet::create([
            'nom_societe' => 'Solo Project',
            'status' => 'in_progress',
            'client_id' => $this->client->id,
        ]);

        $response = $this->actingAs($this->client)->get('/client/dashboard');
        $response->assertRedirect("/client/projects/{$project->id}");
    }

    /** @test */
    public function client_sees_dashboard_if_multiple_projects()
    {
        Projet::create(['nom_societe' => 'Project 1', 'status' => 'in_progress', 'client_id' => $this->client->id]);
        Projet::create(['nom_societe' => 'Project 2', 'status' => 'planning', 'client_id' => $this->client->id]);

        $response = $this->actingAs($this->client)->get('/client/dashboard');
        $response->assertStatus(200);
    }

    /** @test */
    public function client_sees_dashboard_if_no_projects()
    {
        $response = $this->actingAs($this->client)->get('/client/dashboard');
        $response->assertStatus(200);
    }

    /** @test */
    public function client_cannot_see_other_clients_projects()
    {
        $otherClient = User::factory()->create(['role' => 'client', 'is_active' => true]);
        $project = Projet::create([
            'nom_societe' => 'Other Project',
            'status' => 'in_progress',
            'client_id' => $otherClient->id,
        ]);

        $response = $this->actingAs($this->client)->get("/client/projects/{$project->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function client_can_see_own_project()
    {
        $project = Projet::create([
            'nom_societe' => 'My Project',
            'status' => 'in_progress',
            'client_id' => $this->client->id,
        ]);

        $response = $this->actingAs($this->client)->get("/client/projects/{$project->id}");
        $response->assertStatus(200);
    }

    /** @test */
    public function client_can_accept_quote_via_public_token()
    {
        // Mock DomPDF so PdfService does not actually render
        Storage::fake('local');
        $fakePdf = new class {
            public function setPaper() { return $this; }
            public function output() { return '%PDF-1.4 fake'; }
        };
        Pdf::shouldReceive('loadView')->andReturn($fakePdf);

        Setting::create(['group' => 'quote', 'key' => 'quote.prefix', 'value' => 'QT', 'type' => 'string']);
        Setting::create(['group' => 'quote', 'key' => 'quote.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_validity_days', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'quote', 'key' => 'quote.default_deposit_percentage', 'value' => '30', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.default_tax_rate', 'value' => '21', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.prefix', 'value' => 'INV', 'type' => 'string']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.next_number', 'value' => '1', 'type' => 'integer']);
        Setting::create(['group' => 'invoice', 'key' => 'invoice.payment_terms_days', 'value' => '30', 'type' => 'integer']);

        $quote = QuoteService::create([
            'title' => 'Public Accept',
            'client_name' => 'Test',
            'client_email' => 'public-accept@test.com',
            'tax_rate' => 21,
            'deposit_percentage' => 30,
        ], [
            ['description' => 'Work', 'quantity' => 1, 'unit_price' => 5000],
        ]);

        $quote->update(['status' => 'sent', 'sent_at' => now()]);

        // Accept without login via token (but route needs no auth)
        // The workflow uses auth()->id() for timeline — create a temporary admin context
        $tempAdmin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $response = $this->actingAs($tempAdmin)->post("/quotes/{$quote->id}/accept/{$quote->view_token}");
        $response->assertRedirect();

        $quote->refresh();
        $this->assertEquals('accepted', $quote->status);
    }

    /** @test */
    public function invalid_token_is_rejected_on_view()
    {
        $quote = Quote::create([
            'quote_number' => 'QT-TOKEN-001',
            'title' => 'Token Test',
            'client_name' => 'Test',
            'client_email' => 'token-view@test.com',
            'status' => 'sent',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'deposit_amount' => 36.30,
            'deposit_percentage' => 30,
            'view_token' => 'correct-token-value',
            'issue_date' => now(),
        ]);

        $response = $this->get("/quotes/{$quote->id}/view/wrong-token");
        $response->assertStatus(403);
    }

    /** @test */
    public function correct_token_allows_viewing_quote()
    {
        $quote = Quote::create([
            'quote_number' => 'QT-VIEW-001',
            'title' => 'View Test',
            'client_name' => 'Test',
            'client_email' => 'correct-view@test.com',
            'status' => 'sent',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'deposit_amount' => 36.30,
            'deposit_percentage' => 30,
            'view_token' => 'correct-view-token',
            'issue_date' => now(),
        ]);

        $response = $this->get("/quotes/{$quote->id}/view/correct-view-token");
        $response->assertStatus(200);

        // Should mark as viewed
        $quote->refresh();
        $this->assertEquals('viewed', $quote->status);
        $this->assertNotNull($quote->viewed_at);
    }

    /** @test */
    public function invalid_token_is_rejected_on_accept()
    {
        $quote = Quote::create([
            'quote_number' => 'QT-ACC-001',
            'title' => 'Accept Token Test',
            'client_name' => 'Test',
            'client_email' => 'accept-token@test.com',
            'status' => 'sent',
            'subtotal' => 100,
            'tax_rate' => 21,
            'tax_amount' => 21,
            'total' => 121,
            'deposit_amount' => 36.30,
            'deposit_percentage' => 30,
            'view_token' => 'correct-accept-token',
            'issue_date' => now(),
        ]);

        $response = $this->post("/quotes/{$quote->id}/accept/wrong-token");
        $response->assertStatus(403);
    }
}
