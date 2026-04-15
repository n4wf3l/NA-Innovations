<?php
namespace App\Http\Controllers\Dev;

use App\Models\Projet;
use App\Models\Setting;
use App\Models\TimeEntry;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $myProjects = Projet::where('developer_id', $user->id)
            ->with('client')
            ->latest()
            ->get();

        $githubInactivityEnabled = \App\Services\GithubActivityService::isEnabled();
        $sharedGithubProjectsCount = $githubInactivityEnabled
            ? $myProjects->filter(fn ($p) => $p->github_repo && $p->show_commits_to_client)->count()
            : 0;

        $pendingProjects = Projet::whereNull('developer_id')
            ->where('status', 'planning')
            ->with('client', 'lead.referralPartner.user')
            ->latest()
            ->get();

        $stats = [
            'myActive' => $myProjects->whereIn('status', ['in_progress', 'review'])->count(),
            'myCompleted' => $myProjects->where('status', 'completed')->count(),
            'pendingClaim' => $pendingProjects->count(),
            'totalAssigned' => $myProjects->count(),
        ];

        $monthlyCompleted = [];
        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();
            $monthlyCompleted[] = [
                'month' => $start->format('M'),
                'count' => Projet::where('developer_id', $user->id)->where('status', 'completed')
                    ->whereBetween('end_date', [$start, $end])->count(),
            ];
        }

        $totalBudgetManaged = Projet::where('developer_id', $user->id)->sum('budget');

        // Settings toggles
        $showEarnings = Setting::get('dev.show_earnings', '1') === '1';
        $requireApproval = Setting::get('dev.require_time_approval', '1') === '1';
        $showSkillsMatching = Setting::get('dev.show_skills_matching', '1') === '1';

        $earningsThisMonth = 0;
        $earningsLast6Months = [];
        $pendingApprovalHours = 0;
        $skillsMatchedProjects = [];

        if ($showEarnings) {
            $rate = (float) ($user->hourly_rate ?? 0);
            $startMonth = now()->startOfMonth();
            $endMonth = now()->endOfMonth();
            $hoursThisMonth = TimeEntry::where('user_id', $user->id)
                ->where('is_billable', true)
                ->where('approval_status', 'approved')
                ->whereBetween('date', [$startMonth, $endMonth])
                ->sum('hours');
            $earningsThisMonth = round($hoursThisMonth * $rate, 2);

            for ($i = 5; $i >= 0; $i--) {
                $s = now()->subMonths($i)->startOfMonth();
                $e = now()->subMonths($i)->endOfMonth();
                $h = TimeEntry::where('user_id', $user->id)
                    ->where('is_billable', true)
                    ->where('approval_status', 'approved')
                    ->whereBetween('date', [$s, $e])
                    ->sum('hours');
                $earningsLast6Months[] = [
                    'month' => $s->format('M'),
                    'amount' => round($h * $rate, 2),
                ];
            }
        }

        if ($requireApproval) {
            $pendingApprovalHours = TimeEntry::where('user_id', $user->id)
                ->where('approval_status', 'pending')
                ->sum('hours');
        }

        if ($showSkillsMatching) {
            $skills = is_array($user->skills) ? array_map('strtolower', $user->skills) : [];
            $skillsMatchedProjects = $pendingProjects->filter(function ($p) use ($skills) {
                if (empty($skills) || empty($p->langage_programmation)) return false;
                $lang = strtolower($p->langage_programmation);
                foreach ($skills as $s) {
                    if ($s && str_contains($lang, $s)) return true;
                }
                return false;
            })->values();
        }

        return Inertia::render('Dev/Dashboard', [
            'myProjects' => $myProjects,
            'pendingProjects' => $pendingProjects,
            'stats' => $stats,
            'monthlyCompleted' => $monthlyCompleted,
            'totalBudgetManaged' => $totalBudgetManaged,
            'devSettings' => [
                'showEarnings' => $showEarnings,
                'requireApproval' => $requireApproval,
                'showSkillsMatching' => $showSkillsMatching,
            ],
            'earningsThisMonth' => $earningsThisMonth,
            'earningsLast6Months' => $earningsLast6Months,
            'pendingApprovalHours' => round((float) $pendingApprovalHours, 2),
            'skillsMatchedProjects' => $skillsMatchedProjects,
            'sharedGithubProjectsCount' => $sharedGithubProjectsCount,
            'githubInactivityThresholdDays' => \App\Services\GithubActivityService::INACTIVITY_THRESHOLD_DAYS,
        ]);
    }
}
