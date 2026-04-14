<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'phone' => $request->user()->phone,
                    'initial' => strtoupper(substr($request->user()->name, 0, 1)),
                    'avatar' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null,
                    'company_name' => $request->user()->company_name,
                    'github_username' => $request->user()->github_username,
                    'preferences' => $request->user()->preferences ?? [
                        'email_notifications' => true,
                        'name_display' => 'full',
                        'currency' => 'EUR',
                        'privacy_full_name' => true,
                    ],
                    'two_factor_enabled' => (bool) $request->user()->two_factor_enabled,
                ] : null,
            ],
            'locale' => app()->getLocale(),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'notifications' => $request->user()
                ? \App\Models\NotificationLog::where('user_id', $request->user()->id)
                    ->latest()
                    ->take(10)
                    ->get()
                : [],
            'teamCounts' => \Illuminate\Support\Facades\Cache::remember('team_counts', 600, function () {
                return [
                    'partners' => \App\Models\User::where('role', 'referral_partner')->where('is_active', true)->count(),
                    'developers' => \App\Models\User::where('role', 'developer')->where('is_active', true)->count(),
                    'admins' => \App\Models\User::where('role', 'admin')->where('is_active', true)->count(),
                ];
            }),
            'activityChartMode' => $request->user() && $request->user()->role === 'admin'
                ? \App\Models\Setting::get('activity_chart_mode', 'hour')
                : null,
            'financialUnlocked' => (function () use ($request) {
                if (!$request->user()) return false;
                $unlockedAt = session('financial_unlocked_at');
                if (!$unlockedAt) return false;
                return (now()->timestamp - $unlockedAt) <= 900;
            })(),
            'socialLinks' => \App\Models\Setting::where('group', 'social')->get()
                ->filter(fn($s) => !empty($s->value))
                ->mapWithKeys(fn($s) => [str_replace('social.', '', $s->key) => $s->value]),
            'branding' => [
                'logo_path' => \App\Models\Setting::get('branding.logo_path', ''),
                'company_name' => \App\Models\Setting::get('branding.company_name', 'NA Innovations'),
                'tagline' => \App\Models\Setting::get('branding.tagline', ''),
            ],
            'brochure' => (function () {
                $path = \App\Models\Setting::get('brochure.file_path', '');
                $exists = $path && \Illuminate\Support\Facades\Storage::disk('public')->exists($path);
                return [
                    'url' => $exists ? route('public.brochure') : '',
                    'updated_at' => \App\Models\Setting::get('brochure.updated_at', ''),
                ];
            })(),
            'appUrl' => config('app.url', 'https://nainnovations.be'),
            'devSettings' => (function () use ($request) {
                if (!$request->user() || !in_array($request->user()->role, ['developer', 'admin'])) {
                    return null;
                }
                $keys = [
                    'dev.show_earnings',
                    'dev.show_hourly_rate',
                    'dev.require_time_approval',
                    'dev.allow_release',
                    'dev.show_skills_matching',
                    'dev.show_team_contacts',
                    'dev.show_milestones',
                    'dev.show_credentials',
                    'dev.show_messaging',
                    'dev.allow_blocked_status',
                    'dev.show_useful_links',
                    'dev.decloisoned_notes',
                ];
                $out = [];
                foreach ($keys as $k) {
                    $short = str_replace('dev.', '', $k);
                    $out[$short] = \App\Models\Setting::get($k, '1') === '1';
                }
                return $out;
            })(),
            'pendingTimeApprovals' => (function () use ($request) {
                if (!$request->user() || $request->user()->role !== 'admin') return 0;
                return \Illuminate\Support\Facades\Cache::remember('pending_time_approvals_count', 60, function () {
                    try {
                        return \App\Models\TimeEntry::where('approval_status', 'pending')->count();
                    } catch (\Throwable $e) {
                        return 0;
                    }
                });
            })(),
        ];
    }
}
