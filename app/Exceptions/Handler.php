<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (NotFoundHttpException $e, Request $request) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Not found.'], 404);
            }

            return Inertia::render('Errors/404')
                ->toResponse($request)
                ->setStatusCode(404);
        });

        $this->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, Request $request) {
            $code = $e->getStatusCode();
            $pages = [403, 419, 429, 500, 503];

            if (in_array($code, $pages)) {
                if ($request->wantsJson() || $request->is('api/*')) {
                    return response()->json(['message' => $e->getMessage() ?: 'Error'], $code);
                }

                return Inertia::render("Errors/{$code}")
                    ->toResponse($request)
                    ->setStatusCode($code);
            }
        });
    }
}
