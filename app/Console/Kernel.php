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

        // Backups quotidiens (03:00 UTC ~ 04-05h Belgique) + monitoring santé + cleanup
        $schedule->command('backup:clean')->dailyAt('02:30')->name('backup-clean')->onOneServer();
        $schedule->command('backup:run')->dailyAt('03:00')->name('backup-run')->onOneServer();
        $schedule->command('backup:monitor')->dailyAt('10:00')->name('backup-monitor')->onOneServer();

        // Digest quotidien par admin — 09:00 Europe/Brussels
        $schedule->command('nai:admin-digest')
            ->dailyAt('09:00')
            ->timezone('Europe/Brussels')
            ->name('admin-daily-digest')
            ->onOneServer();

        // Rappel aux devs qui n'ont pas encodé de temps depuis >=7 jours sur un projet actif
        // Daily at 09:15 Europe/Brussels — in-app notif uniquement
        $schedule->call(function () {
            $threshold = now()->subDays(7);
            $devsWithActiveProjects = \App\Models\User::where('role', 'developer')
                ->where('is_active', true)
                ->whereHas('assignedProjects', fn ($q) => $q->whereIn('status', ['in_progress', 'review']))
                ->get();

            foreach ($devsWithActiveProjects as $dev) {
                $lastEntry = \App\Models\TimeEntry::where('user_id', $dev->id)
                    ->orderByDesc('date')
                    ->first();

                if ($lastEntry && $lastEntry->date->greaterThanOrEqualTo($threshold)) {
                    continue;
                }

                // Skip if we already notified in the last 3 days
                $recent = \App\Models\NotificationLog::where('user_id', $dev->id)
                    ->where('type', 'time_entry_reminder')
                    ->where('created_at', '>=', now()->subDays(3))
                    ->exists();
                if ($recent) continue;

                $daysSince = $lastEntry ? (int) $lastEntry->date->diffInDays(now()) : 7;

                \App\Models\NotificationLog::create([
                    'user_id' => $dev->id,
                    'type' => 'time_entry_reminder',
                    'title' => __('Rappel : encodez vos heures'),
                    'message' => __('Vous n\'avez pas encodé de temps depuis :days jours. Pensez à ajouter vos heures pour ne pas retarder votre validation.', ['days' => $daysSince]),
                    'action_url' => '/dev/time-entries',
                    'is_read' => false,
                ]);
            }
        })->dailyAt('09:15')->timezone('Europe/Brussels')->name('dev-time-entry-reminder');

        // Notify developers when their shared GitHub repo has been inactive for >=3 days
        // Runs daily at 09:00 Europe/Brussels (handles DST automatically)
        $schedule->call(function () {
            \App\Services\GithubActivityService::notifyInactiveDevelopers();
        })->dailyAt('09:00')->timezone('Europe/Brussels')->name('github-inactivity-notify');

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
