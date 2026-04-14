<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Support\CurrentAdmin::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share dynamic branding (admin-editable) with all blade views
        // so login/forgot/reset/confirm pages reflect the current company name & logo.
        view()->composer('*', function ($view) {
            try {
                $companyName = \App\Models\Setting::get('branding.company_name', config('app.name', 'NA Innovations'));
                $logoPath = \App\Models\Setting::get('branding.logo_path', '');
                $logoUrl = $logoPath ? asset('storage/' . $logoPath) : asset('white-logo-small.png');
                $view->with('brandCompanyName', $companyName);
                $view->with('brandLogoUrl', $logoUrl);
            } catch (\Throwable $e) {
                $view->with('brandCompanyName', config('app.name', 'NA Innovations'));
                $view->with('brandLogoUrl', asset('white-logo-small.png'));
            }
        });
    }
}
