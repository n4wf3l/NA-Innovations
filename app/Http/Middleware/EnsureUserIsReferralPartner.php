<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsReferralPartner
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isReferralPartner()) {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
