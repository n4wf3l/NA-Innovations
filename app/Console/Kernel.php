<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Mark overdue invoices daily at 8am
        $schedule->call(function () {
            \App\Services\WorkflowService::checkOverdueInvoices();
        })->dailyAt('08:00');

        // Auto-renew expired services + mark expiring_soon daily at 7am
        $schedule->call(function () {
            \App\Services\WorkflowService::autoRenewServices();
        })->dailyAt('07:00');

        // Send tiered service expiry notifications daily at 7:30am
        $schedule->call(function () {
            \App\Services\WorkflowService::sendServiceExpiryNotifications();
        })->dailyAt('07:30');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
