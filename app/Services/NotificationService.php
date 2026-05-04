<?php

namespace App\Services;

use App\Mail\TemplateMail;
use App\Models\EmailTemplate;
use App\Models\NotificationLog;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Central notification service.
 * Single entry point for all email + in-app notifications.
 *
 * Transactional emails are always sent.
 * Informational emails respect user preferences.
 */
class NotificationService
{
    /**
     * Mapping: template slug => user preference key.
     * If a slug is NOT in this list, it's transactional (always sent).
     */
    private const SLUG_TO_PREF = [
        // Client informatifs
        'project-status-update' => 'notify_project_updates',
        'project-completed' => 'notify_project_updates',
        'project-assigned-dev' => 'notify_project_updates',
        'service-expiry-alert' => 'notify_service_expiry',
        'service-renewed' => 'notify_service_expiry',

        // Partner informatifs
        'lead-won-partner' => 'notify_lead_updates',
        'commission-earned' => 'notify_commissions',

        // Dev informatifs
        'client-comment' => 'notify_project_comments',

        // Admin informatifs
        'new-lead-admin' => 'notify_new_leads',
        'project-claimed-admin' => 'notify_project_updates',
        'quote-viewed-admin' => 'notify_quote_activity',
        'registration-pending-admin' => 'notify_registrations',
    ];

    /**
     * Check if an active email template exists for the given slug and locale.
     * Useful for controllers to verify before calling send(), so they can
     * flash a warning to the user if the template is missing.
     */
    public static function templateExists(string $slug, string $locale = 'en'): bool
    {
        return EmailTemplate::where('slug', $slug)
            ->where('is_active', true)
            ->where(function ($q) use ($locale) {
                $q->where('locale', $locale)->orWhere('locale', 'en');
            })
            ->exists();
    }

    /**
     * Send a notification to a user.
     *
     * @param User          $recipient      The user to notify
     * @param string        $templateSlug   The email template slug
     * @param array         $variables      Variables to replace in subject/body
     * @param string|null   $attachmentPath Path to PDF attachment (in local storage)
     * @param bool          $transactional  Force send even if user disabled notifications
     * @param string|null   $actionUrl      In-app notification link
     */
    public static function send(
        User $recipient,
        string $templateSlug,
        array $variables = [],
        ?string $attachmentPath = null,
        bool $transactional = false,
        ?string $actionUrl = null,
    ): void {
        // Default to platform's current locale (admin's view at the moment of the action),
        // not the recipient's stored preference. This keeps emails consistent with the
        // language used by the sender / current user when the action was triggered.
        $appLocale = app()->getLocale();
        $locale = in_array($appLocale, ['fr', 'en', 'nl']) ? $appLocale : 'fr';

        // 1. Load template from DB
        $template = EmailTemplate::where('slug', $templateSlug)
            ->where('locale', $locale)
            ->where('is_active', true)
            ->first();

        // Fallback to English
        if (!$template) {
            $template = EmailTemplate::where('slug', $templateSlug)
                ->where('locale', 'en')
                ->where('is_active', true)
                ->first();
        }

        if (!$template) {
            Log::warning("NotificationService: No template found for slug={$templateSlug} locale={$locale}");
            return;
        }

        // 2. Replace variables
        $subject = self::replaceVariables($template->subject, $variables);
        $body = self::replaceVariables($template->body, $variables);
        // Convert HTML to clean plain text: replace block tags with spaces, then strip
        $plain = str_replace(['<br>', '<br/>', '<br />', '</p>', '</li>', '</h1>', '</h2>', '</h3>', '</h4>'], "\n", $body);
        $plain = str_replace(['<p>', '<li>', '<ul>', '</ul>', '<ol>', '</ol>'], ' ', $plain);
        $plainBody = trim(preg_replace('/\s+/', ' ', strip_tags($plain)));

        // 3. Always create in-app notification
        try {
            NotificationLog::create([
                'user_id' => $recipient->id,
                'type' => $templateSlug,
                'title' => $subject,
                'message' => mb_substr($plainBody, 0, 255),
                'action_url' => $actionUrl,
                'is_read' => false,
            ]);
        } catch (\Exception $e) {
            Log::warning("NotificationService: Failed to create notification log: {$e->getMessage()}");
        }

        // 4. Check if email should be sent
        if (!$transactional) {
            $prefKey = self::SLUG_TO_PREF[$templateSlug] ?? null;
            if ($prefKey) {
                $prefs = $recipient->preferences ?? [];
                $notifications = $prefs['notifications'] ?? [];
                if (isset($notifications[$prefKey]) && !$notifications[$prefKey]) {
                    return; // User disabled this notification
                }
            }
        }

        // 5. Send email
        try {
            Mail::to($recipient->email)->send(
                new TemplateMail($subject, $body, $attachmentPath)
            );
        } catch (\Exception $e) {
            Log::error("NotificationService: Failed to send email to {$recipient->email}: {$e->getMessage()}");
        }
    }

    /**
     * Send to all admins.
     */
    public static function sendToAdmins(
        string $templateSlug,
        array $variables = [],
        bool $transactional = false,
        ?string $actionUrl = null,
    ): void {
        $admins = User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
            ->where('role', 'admin')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            self::send($admin, $templateSlug, $variables, null, $transactional, $actionUrl);
        }
    }

    /**
     * Replace {{ variable }} placeholders in text.
     */
    private static function replaceVariables(string $text, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $text = preg_replace('/\{\{\s*' . preg_quote($key, '/') . '\s*\}\}/', $value ?? '', $text);
        }
        // Remove any unreplaced {{ variables }} so they never show in the output
        $text = preg_replace('/\{\{[^}]+\}\}/', '', $text);
        return $text;
    }
}
