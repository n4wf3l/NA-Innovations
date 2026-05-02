<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Resolve project base path (auto-detect across deployment layouts)
|--------------------------------------------------------------------------
|
| Three layouts supported, tried in order:
|
| 1. Combell, webroot = /www/public/  →  /home/laravel-app/
|       index.php is at /home/www/public/, so base = ../../laravel-app
|
| 2. Combell, webroot = /www/         →  /home/laravel-app/
|       index.php is at /home/www/ (public/ contents moved up one level),
|       so base = ../laravel-app
|
| 3. Standard local dev               →  the parent of public/
|       index.php is at /project/public/, so base = ..
|
| The first path that contains a vendor/autoload.php wins.
|
*/

$candidates = [
    __DIR__.'/../../laravel-app',
    __DIR__.'/../laravel-app',
    __DIR__.'/..',
];

$basePath = null;
foreach ($candidates as $candidate) {
    if (file_exists($candidate.'/vendor/autoload.php')) {
        $basePath = $candidate;
        break;
    }
}

if ($basePath === null) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    exit("Bootstrap error: could not locate Laravel application (no vendor/autoload.php found in any expected location).\n");
}

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
*/

if (file_exists($maintenance = $basePath.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
*/

require $basePath.'/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
*/

$app = require_once $basePath.'/bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Override public path to the actual served document root
|--------------------------------------------------------------------------
|
| Default Laravel resolves public_path() to base_path('public') = the
| public/ folder *inside* the project. On Combell that folder lives at
| /laravel-app/public/ and is NOT served by Apache (webroot is /www/).
| Result: Storage::disk('public')->put(...) writes to a directory that
| nothing serves, and uploaded images appear broken.
|
| __DIR__ here is, by construction, the actual webroot Apache serves
| (it is the directory containing this index.php). Forcing the public
| path to __DIR__ makes public_path('uploads') resolve to a folder that
| IS publicly served, so Storage::disk('public') writes end up where
| the .htaccess rewrite (storage/* -> uploads/*) can serve them.
|
| In standard local dev __DIR__ already equals base_path('public'), so
| this is a no-op there.
|
*/

$app->usePublicPath(__DIR__);

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
