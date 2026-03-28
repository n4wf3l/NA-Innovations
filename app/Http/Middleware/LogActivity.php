<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    /**
     * Log every authenticated page view / action.
     * Only logs GET (page views) and POST/PUT/PATCH/DELETE (actions).
     * Skips assets, API polling, and PDF preview requests.
     */
    public function handle(Request $request, Closure $next): Response
    {
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
            $method === 'GET' => 'page_view',
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
            ActivityLog::create([
                'user_id' => $request->user()->id,
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
