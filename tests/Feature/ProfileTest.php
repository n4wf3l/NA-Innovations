<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        // Test client profile (Inertia page that works)
        $client = User::factory()->create(['role' => 'client', 'is_active' => true]);
        $response = $this->actingAs($client)->get('/client/profile');
        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/profile');

        $user->refresh();
        $this->assertSame('Updated Name', $user->name);
        $this->assertSame('updated@example.com', $user->email);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($user)->delete('/profile', [
            'password' => 'password',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertGuest();
        // User is soft-deleted
        $this->assertSoftDeleted('users', ['id' => $user->id]);
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $response = $this->actingAs($user)
            ->from('/profile')
            ->delete('/profile', ['password' => 'wrong-password']);

        $response->assertSessionHasErrors()->assertRedirect('/profile');
        $this->assertNotNull($user->fresh());
    }
}
