<?php

namespace App\Http\Controllers\Api;

use App\Models\Projet;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ProjectCommitsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function __invoke(Projet $project): JsonResponse
    {
        $user = Auth::user();
        $role = $user->role;

        // Access control
        if ($role === 'client') {
            if ($project->client_id != $user->id) {
                return response()->json(['error' => 'Forbidden', 'commits' => []], 403);
            }
            if (!$project->show_commits_to_client) {
                return response()->json(['error' => 'Commits not visible', 'commits' => []], 403);
            }
        } elseif ($role === 'developer') {
            if ($project->developer_id != $user->id) {
                return response()->json(['error' => 'Forbidden', 'commits' => []], 403);
            }
        }

        if (!$project->github_repo) {
            return response()->json(['error' => 'No repository linked', 'commits' => []]);
        }

        // Normalize the repo to "owner/repo" format. Tolerate inputs like:
        //   "/n4wf3l/talentive", " n4wf3l/talentive ",
        //   "https://github.com/n4wf3l/talentive", "github.com/n4wf3l/talentive.git"
        $repo = trim($project->github_repo);
        $repo = preg_replace('#^https?://(www\.)?github\.com/#i', '', $repo);
        $repo = trim($repo, " /\t\n\r");
        $repo = preg_replace('/\.git$/i', '', $repo);

        if (!preg_match('#^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$#', $repo)) {
            return response()->json([
                'error' => 'Invalid repository format. Expected "owner/repo".',
                'commits' => [],
            ]);
        }

        // Get the token from the user who linked the repo. Bypass the tenant
        // scope here: a client (or developer) querying their own project must
        // be able to read the admin's github_token even though the admin is in
        // a different tenant from the perspective of the requester.
        $linkedUser = $project->github_linked_by
            ? User::withoutGlobalScope(\App\Models\Scopes\UserAdminTenantScope::class)
                ->find($project->github_linked_by)
            : null;
        $token = $linkedUser?->github_token;

        if (!$token) {
            return response()->json([
                'error' => 'GitHub access lost. The user who linked this repo needs to reconnect.',
                'commits' => [],
            ]);
        }

        // For clients, optionally hide commits made BEFORE the project's
        // start_date. If start_date is not set explicitly, no filter is applied
        // (better to show the existing repo history than hide everything when
        // a repo is linked to an already-running project).
        $sinceIso = null;
        if ($role === 'client' && $project->start_date) {
            $sinceIso = $project->start_date->copy()->startOfDay()->toIso8601String();
        }

        $cacheKey = "github_commits_{$project->id}_" . ($sinceIso ?: 'all');

        $result = Cache::remember($cacheKey, 300, function () use ($repo, $token, $sinceIso) {
            return $this->fetchCommits($repo, $token, $sinceIso);
        });

        return response()->json($result);
    }

    private function fetchCommits(string $repo, string $token, ?string $sinceIso = null): array
    {
        try {
            $query = ['per_page' => 20];
            if ($sinceIso) {
                $query['since'] = $sinceIso;
            }

            $response = Http::withToken($token)
                ->withHeaders([
                    'Accept' => 'application/vnd.github.v3+json',
                    'User-Agent' => 'NA-Innovations-Platform',
                ])
                ->get("https://api.github.com/repos/{$repo}/commits", $query);

            if ($response->status() === 401) {
                return [
                    'error' => 'GitHub token expired. The user who linked this repo needs to reconnect.',
                    'commits' => [],
                ];
            }

            if (!$response->successful()) {
                $status = $response->status();
                $hint = match ($status) {
                    404 => "Repository '{$repo}' not found on GitHub. Check the format (owner/repo) and that the linked user has access.",
                    403 => 'GitHub rate limit reached or insufficient permissions.',
                    default => "GitHub API returned status {$status}.",
                };
                return ['error' => $hint, 'commits' => []];
            }

            $commits = collect($response->json())->map(function ($commit) {
                return [
                    'hash' => $commit['sha'] ?? '',
                    'message' => $commit['commit']['message'] ?? '',
                    'author_name' => $commit['commit']['author']['name'] ?? '',
                    'author_avatar' => $commit['author']['avatar_url'] ?? null,
                    'date' => $commit['commit']['author']['date'] ?? '',
                ];
            })->toArray();

            return ['commits' => $commits];
        } catch (\Exception $e) {
            return ['error' => 'Failed to connect to GitHub', 'commits' => []];
        }
    }
}
