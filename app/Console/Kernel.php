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

        // Send invoice overdue reminders daily at 9am
        $schedule->call(function () {
            \App\Services\WorkflowService::sendInvoiceReminders();
        })->dailyAt('09:00');

        // Partner prospect follow-up reminders
        $schedule->call(function () {
            $due = \App\Models\PartnerProspect::dueFollowUp()->with('user')->get();
            foreach ($due as $prospect) {
                \App\Models\NotificationLog::create([
                    'user_id' => $prospect->user_id,
                    'type' => 'prospect_follow_up',
                    'title' => 'Relance : ' . $prospect->name,
                    'message' => $prospect->notes ? $prospect->name . ' — ' . \Illuminate\Support\Str::limit($prospect->notes, 100) : 'Il est temps de relancer ' . $prospect->name,
                    'action_url' => '/partner/prospects',
                    'is_read' => false,
                ]);
                if ($prospect->send_email_reminder && $prospect->user) {
                    $prefs = $prospect->user->preferences ?? [];
                    if ($prefs['email_notifications'] ?? true) {
                        try {
                            \Illuminate\Support\Facades\Mail::to($prospect->user->email)->send(
                                new \App\Mail\TemplateMail(
                                    'Relance prospect : ' . $prospect->name,
                                    '<p>Bonjour ' . $prospect->user->name . ',</p><p>C\'est le moment de relancer <strong>' . $prospect->name . '</strong>' . ($prospect->company_name ? ' (' . $prospect->company_name . ')' : '') . '.</p>' . ($prospect->notes ? '<blockquote>' . $prospect->notes . '</blockquote>' : '') . '<p>Connectez-vous pour voir vos prospects.</p>'
                                )
                            );
                        } catch (\Exception $e) {}
                    }
                }
                $prospect->update(['follow_up_notified' => true]);
            }
        })->dailyAt('08:30')->name('prospect-follow-ups');

        // Send invoice due date reminders (J-7, J-3, J-1) daily at 09:30
        $schedule->call(function () {
            \App\Services\WorkflowService::sendInvoiceDueReminders();
        })->dailyAt('09:30')->name('invoice-due-reminders');

        // Process partner reminders every 15 minutes
        $schedule->call(function () {
            $dueReminders = \App\Models\PartnerReminder::due()->with('user')->get();
            foreach ($dueReminders as $reminder) {
                // Create in-app notification
                \App\Models\NotificationLog::create([
                    'user_id' => $reminder->user_id,
                    'type' => 'reminder',
                    'title' => __('Rappel : relancer :name', ['name' => $reminder->contact_name]),
                    'message' => $reminder->notes ? $reminder->contact_name . ' — ' . \Illuminate\Support\Str::limit($reminder->notes, 100) : __('Il est temps de relancer :name', ['name' => $reminder->contact_name]),
                    'action_url' => '/partner/reminders',
                    'is_read' => false,
                ]);

                // Send email if enabled
                if ($reminder->send_email_notification && $reminder->user) {
                    try {
                        $tpl = \App\Models\EmailTemplate::where('slug', 'partner-reminder')
                            ->where('locale', $reminder->user->locale ?? app()->getLocale())
                            ->where('is_active', true)
                            ->first();
                        if ($tpl) {
                            $subject = str_replace(['{{ contact_name }}', '{{ company }}'], [$reminder->contact_name, $reminder->company_name ?? ''], $tpl->subject);
                            $body = str_replace(['{{ partner_name }}', '{{ contact_name }}', '{{ company }}', '{{ phone }}', '{{ email }}', '{{ notes }}'], [$reminder->user->name, $reminder->contact_name, $reminder->company_name ?? '-', $reminder->contact_phone ?? '-', $reminder->contact_email ?? '-', $reminder->notes ?? '-'], $tpl->body);
                            \Illuminate\Support\Facades\Mail::to($reminder->user->email)->send(new \App\Mail\TemplateMail($subject, $body));
                        }
                    } catch (\Exception $e) {
                        // Silent fail — don't break the loop
                    }
                }

                $reminder->update(['status' => 'sent', 'sent_at' => now()]);
            }
        })->everyFifteenMinutes()->name('partner-reminders');
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
