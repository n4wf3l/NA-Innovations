<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\ActivityLog;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = $request->user();

        // 2FA check — if enabled, logout and redirect to 2FA challenge
        if ($user->two_factor_enabled && $user->two_factor_secret) {
            $userId = $user->id;
            $remember = $request->boolean('remember');

            Auth::guard('web')->logout();
            $request->session()->regenerate();

            $request->session()->put('2fa:user_id', $userId);
            $request->session()->put('2fa:remember', $remember);

            return redirect()->route('two-factor.challenge');
        }

        $request->session()->regenerate();
        session()->put('2fa_verified', true);

        // Track login
        $user->update(['last_login_at' => now()]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'properties' => ['role' => $user->role],
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);

        $home = match ($user->role) {
            'admin' => '/admin/dashboard',
            'referral_partner' => '/partner/dashboard',
            'developer' => '/dev/dashboard',
            'client' => '/client/dashboard',
            default => '/',
        };

        // Clear intended URL if it's an API/polling route
        $intended = session()->pull('url.intended', $home);
        if (str_contains($intended, '/api/') || str_contains($intended, '/poll')) {
            $intended = $home;
        }

        return redirect()->to($intended)->with('success', "Bienvenue, {$user->name} !");
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if ($request->user()) {
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'logout',
                'ip_address' => $request->ip(),
                'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
