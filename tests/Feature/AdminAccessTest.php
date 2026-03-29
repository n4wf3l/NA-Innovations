<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_cannot_access_admin_dashboard()
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');
    }

    /** @test */
    public function client_cannot_access_admin_dashboard()
    {
        $client = User::factory()->create(['role' => 'client', 'is_active' => true]);
        $response = $this->actingAs($client)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_access_admin_dashboard()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    /** @test */
    public function inactive_user_cannot_login()
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => false]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // The LoginRequest authenticates then logs out inactive users
        // and throws a ValidationException
        $response->assertSessionHasErrors();
    }

    /** @test */
    public function developer_cannot_access_admin_routes()
    {
        $dev = User::factory()->create(['role' => 'developer', 'is_active' => true]);

        $this->actingAs($dev)->get('/admin/leads')->assertStatus(403);
        $this->actingAs($dev)->get('/admin/invoices')->assertStatus(403);
        $this->actingAs($dev)->get('/admin/commissions')->assertStatus(403);
    }

    /** @test */
    public function partner_cannot_access_admin_routes()
    {
        $partner = User::factory()->create(['role' => 'referral_partner', 'is_active' => true]);

        $this->actingAs($partner)->get('/admin/leads')->assertStatus(403);
        $this->actingAs($partner)->get('/admin/clients')->assertStatus(403);
    }

    /** @test */
    public function client_can_access_client_dashboard()
    {
        $client = User::factory()->create(['role' => 'client', 'is_active' => true]);

        $response = $this->actingAs($client)->get('/client/dashboard');
        // Client dashboard returns 200 (listing projects) or redirect if exactly 1 project
        $response->assertSuccessful();
    }

    /** @test */
    public function developer_can_access_dev_dashboard()
    {
        $dev = User::factory()->create(['role' => 'developer', 'is_active' => true]);

        $response = $this->actingAs($dev)->get('/dev/dashboard');
        $response->assertStatus(200);
    }

    /** @test */
    public function guest_cannot_access_client_portal()
    {
        $response = $this->get('/client/dashboard');
        $response->assertRedirect('/login');
    }

    /** @test */
    public function guest_cannot_access_dev_portal()
    {
        $response = $this->get('/dev/dashboard');
        $response->assertRedirect('/login');
    }

    /** @test */
    public function admin_can_access_admin_leads()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($admin)->get('/admin/leads');
        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_access_admin_invoices()
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($admin)->get('/admin/invoices');
        $response->assertStatus(200);
    }
}
