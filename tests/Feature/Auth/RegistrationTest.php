<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    public function test_new_users_can_register_as_developer(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Developer',
            'email' => 'dev@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'developer',
        ]);

        // User is NOT auto-logged in — redirected to pending approval
        $this->assertGuest();
        $response->assertRedirect(route('pending-approval'));

        $this->assertDatabaseHas('users', [
            'email' => 'dev@example.com',
            'role' => 'developer',
            'is_active' => false,
        ]);
    }

    public function test_new_users_can_register_as_partner(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Partner',
            'email' => 'partner@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'referral_partner',
        ]);

        $this->assertGuest();
        $response->assertRedirect(route('pending-approval'));

        $this->assertDatabaseHas('users', [
            'email' => 'partner@example.com',
            'role' => 'referral_partner',
            'is_active' => false,
        ]);
    }

    public function test_cannot_register_as_admin(): void
    {
        $response = $this->post('/register', [
            'name' => 'Hacker',
            'email' => 'hacker@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'admin',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertDatabaseMissing('users', ['email' => 'hacker@example.com']);
    }

    public function test_cannot_register_as_client(): void
    {
        $response = $this->post('/register', [
            'name' => 'Client',
            'email' => 'client@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'client',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertDatabaseMissing('users', ['email' => 'client@example.com']);
    }
}
