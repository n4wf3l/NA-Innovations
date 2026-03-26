<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        // Force a full page redirect for Inertia requests going to a Blade page
        if ($request->header('X-Inertia')) {
            return null; // Will trigger 401, handled below
        }

        return route('login');
    }

    protected function unauthenticated($request, array $guards)
    {
        // For Inertia requests, force a full location redirect (not an Inertia visit)
        if ($request->header('X-Inertia')) {
            abort(409, '', [
                'X-Inertia-Location' => route('login'),
            ]);
        }

        parent::unauthenticated($request, $guards);
    }
}
