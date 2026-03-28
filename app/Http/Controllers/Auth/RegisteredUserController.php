<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Verify Turnstile
        $secret = config('services.turnstile.secret_key');
        if ($secret) {
            $token = $request->input('cf-turnstile-response');
            if (!$token) {
                throw ValidationException::withMessages(['captcha' => 'Please complete the security verification.']);
            }
            $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $request->ip(),
            ]);
            if (!$response->json('success')) {
                throw ValidationException::withMessages(['captcha' => 'Security verification failed. Please try again.']);
            }
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:developer,referral_partner'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'is_active' => false,
        ]);

        event(new Registered($user));

        // Confirm to user that registration is pending
        NotificationService::send($user, 'registration-confirmation', [
            'user_name' => $user->name,
            'user_email' => $user->email,
        ], transactional: true);

        // Notify admins of new registration
        NotificationService::sendToAdmins('registration-pending-admin', [
            'user_name' => $user->name,
            'user_email' => $user->email,
            'role' => $user->role,
        ], actionUrl: '/admin/team');

        // Do NOT auto-login — redirect to pending approval page
        return redirect()->route('pending-approval');
    }

    /**
     * Show the pending approval page.
     */
    public function pendingApproval(): View
    {
        return view('auth.pending-approval');
    }
}
