<?php

namespace App\Services;

use App\Models\NotificationLog;
use App\Models\Projet;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GithubActivityService
{
    public const INACTIVITY_THRESHOLD_DAYS = 3;

    public static function isEnabled(): bool
    {
        return Setting::get('dev.notify_github_inactivity', '1') === '1';
    }

    public static function notifyInactiveDevelopers(): void
    {
        if (!self::isEnabled()) {
            return;
        }

        $projects = Projet::withoutGlobalScope(\App\Models\Scopes\ProjetAdminTenantScope::class)
            ->whereNotNull('github_repo')
            ->where('show_commits_to_client', true)
            ->whereNotNull('developer_id')
            ->whereNotNull('github_linked_by')
            ->whereNotIn('status', ['completed', 'cancelled', 'archived'])
            ->with(['developer', 'githubLinkedBy', 'client'])
            ->get();

        foreach ($projects as $project) {
            try {
                self::processProject($project);
            } catch (\Exception $e) {
                Log::warning("GithubActivityService: Failed for project {$project->id}: {$e->getMessage()}");
            }
        }
    }

    private static function processProject(Projet $project): void
    {
        $token = $project->githubLinkedBy?->github_token;
        if (!$token) {
            return;
        }

        $lastCommitDate = self::fetchLastCommitDate($project->github_repo, $token);
        if ($lastCommitDate === null) {
            return;
        }

        $daysInactive = (int) floor(abs(Carbon::now()->diffInDays($lastCommitDate, false)));

        if ($daysInactive < self::INACTIVITY_THRESHOLD_DAYS) {
            return;
        }

        if ($project->github_inactivity_notified_at && $project->github_inactivity_notified_at->isToday()) {
            return;
        }

        $dev = $project->developer;
        if (!$dev) {
            return;
        }

        $clientName = $project->client?->name ?? __('le client');
        $projectName = $project->nom_societe ?: __('votre projet');

        NotificationLog::create([
            'user_id' => $dev->id,
            'type' => 'github_inactivity',
            'title' => __('Inactivité GitHub - :project', ['project' => $projectName]),
            'message' => __(':client voit que vous n\'avez pas poussé de commit depuis :days jours sur :project.', [
                'client' => $clientName,
                'days' => $daysInactive,
                'project' => $projectName,
            ]),
            'action_url' => '/dev/projects/' . $project->id,
            'is_read' => false,
        ]);

        $project->update(['github_inactivity_notified_at' => now()]);
    }

    private static function fetchLastCommitDate(string $repo, string $token): ?Carbon
    {
        try {
            $response = Http::withToken($token)
                ->withHeaders([
                    'Accept' => 'application/vnd.github.v3+json',
                    'User-Agent' => 'NA-Innovations-Platform',
                ])
                ->timeout(10)
                ->get("https://api.github.com/repos/{$repo}/commits", ['per_page' => 1]);

            if (!$response->successful()) {
                return null;
            }

            $commits = $response->json();
            if (empty($commits)) {
                return null;
            }

            $date = $commits[0]['commit']['committer']['date']
                ?? $commits[0]['commit']['author']['date']
                ?? null;

            return $date ? Carbon::parse($date) : null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
