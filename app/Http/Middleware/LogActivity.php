<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    /**
     * Log authenticated mutation actions (POST/PUT/PATCH/DELETE).
     * Skips GET requests, API polling, assets, and PDF preview requests.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip GET requests and API/polling endpoints (only log mutations)
        if ($request->isMethod('GET') || $request->is('api/notifications/*')) {
            return $next($request);
        }

        $response = $next($request);

        // Only log for authenticated users
        if (!$request->user()) {
            return $response;
        }

        // Skip non-page requests (assets, AJAX polling)
        if ($request->is('*.js', '*.css', '*.png', '*.jpg', '*.svg', '*.ico', '*.woff*')) {
            return $response;
        }

        // Skip PDF preview iframes (too noisy)
        if (str_contains($request->path(), '/pdf/preview')) {
            return $response;
        }

        // Determine action type
        $method = $request->method();
        $action = match (true) {
            $method === 'POST' && str_contains($request->path(), 'login') => 'login',
            $method === 'POST' && str_contains($request->path(), 'logout') => 'logout',
            $method === 'POST' => 'create',
            $method === 'PUT' || $method === 'PATCH' => 'update',
            $method === 'DELETE' => 'delete',
            default => 'other',
        };

        // Resolve the subject from route model binding
        $subjectType = null;
        $subjectId = null;
        $routeParams = $request->route()?->parameters() ?? [];
        foreach ($routeParams as $param) {
            if (is_object($param) && method_exists($param, 'getKey')) {
                $subjectType = get_class($param);
                $subjectId = $param->getKey();
                break;
            }
        }

        try {
            $actor = $request->user();
            $adminId = $actor->isAdmin() ? $actor->id : $actor->admin_id;

            ActivityLog::create([
                'user_id' => $actor->id,
                'admin_id' => $adminId,
                'action' => $action,
                'subject_type' => $subjectType,
                'subject_id' => $subjectId,
                'properties' => [
                    'url' => $request->path(),
                    'method' => $method,
                    'route' => $request->route()?->getName(),
                ],
                'ip_address' => $request->ip(),
                'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            ]);
        } catch (\Exception $e) {
            // Never break the app for logging failures
        }

        return $response;
    }
}
