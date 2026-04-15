<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevPortalSettingsController extends BaseAdminController
{
    public const KEYS = [
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
        'dev.notify_github_inactivity',
    ];

    public function index()
    {
        $settings = [];
        foreach (self::KEYS as $key) {
            $settings[$key] = Setting::get($key, '1') === '1';
        }

        return Inertia::render('Admin/Settings/DevPortal', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        foreach (self::KEYS as $key) {
            $value = $request->boolean($key) ? '1' : '0';
            Setting::set($key, $value);
        }

        return redirect()->back()->with('success', __('Paramètres du portail développeur mis à jour.'));
    }
}
