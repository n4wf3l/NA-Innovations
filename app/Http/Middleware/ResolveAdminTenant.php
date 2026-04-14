<?php

namespace App\Http\Middleware;

use App\Support\CurrentAdmin;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveAdminTenant
{
    public function __construct(protected CurrentAdmin $currentAdmin)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isAdmin()) {
            $this->currentAdmin->set($user->id);
        }

        return $next($request);
    }
}
