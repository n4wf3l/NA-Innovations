<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsReferralPartner
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !in_array($request->user()->role, ['referral_partner', 'admin'])) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
