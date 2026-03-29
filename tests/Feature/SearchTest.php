<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\Projet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function search_returns_matching_clients()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        User::factory()->create([
            'role' => 'client',
            'name' => 'John Searchable',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=Searchable');

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'John Searchable']);
    }

    /** @test */
    public function search_requires_minimum_2_chars()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=a');

        $response->assertOk();
        $response->assertJsonCount(0, 'results');
    }

    /** @test */
    public function search_requires_authentication()
    {
        $response = $this->getJson('/api/search?q=test');
        $response->assertStatus(401);
    }

    /** @test */
    public function search_returns_matching_projects()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        Projet::create([
            'nom_societe' => 'Unique Searchable Project',
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=Unique Searchable');

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Unique Searchable Project']);
    }

    /** @test */
    public function search_returns_matching_leads()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        Lead::create([
            'first_name' => 'Findable',
            'last_name' => 'LeadPerson',
            'email' => 'findable@test.com',
            'status' => 'new',
            'source' => 'organic',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=Findable');

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Findable LeadPerson']);
    }

    /** @test */
    public function empty_query_returns_empty_results()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=');

        $response->assertOk();
        $response->assertJsonCount(0, 'results');
    }

    /** @test */
    public function search_returns_matching_partners()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $partnerUser = User::factory()->create([
            'role' => 'referral_partner',
            'name' => 'Partner Findme',
            'is_active' => true,
        ]);

        \App\Models\ReferralPartner::create([
            'user_id' => $partnerUser->id,
            'referral_code' => 'FINDME',
            'default_commission_rate' => 10,
            'payment_method' => 'bank_transfer',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->getJson('/api/search?q=Findme');

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Partner Findme']);
    }
}
