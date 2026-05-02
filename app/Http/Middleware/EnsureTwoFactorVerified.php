<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip on 2FA challenge routes, login, logout, and public routes
        if ($request->routeIs('two-factor.*', 'login', 'logout', 'register', 'password.*')) {
            return $next($request);
        }

        $user = $request->user();

        // No user = let auth middleware handle it
        if (!$user) {
            return $next($request);
        }

        // User doesn't have 2FA enabled = pass through
        if (!$user->two_factor_enabled || !$user->two_factor_secret) {
            return $next($request);
        }

        // 2FA is enabled - check if verified in this session
        if (!session('2fa_verified')) {
            // Logout and redirect to 2FA challenge
            $userId = $user->id;
            \Illuminate\Support\Facades\Auth::guard('web')->logout();
            $request->session()->regenerate();
            $request->session()->put('2fa:user_id', $userId);
            $request->session()->put('2fa:remember', false);

            return redirect()->route('two-factor.challenge');
        }

        return $next($request);
    }
}
