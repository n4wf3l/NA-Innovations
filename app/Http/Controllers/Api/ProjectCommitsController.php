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

        // Get the token from the user who linked the repo
        $linkedUser = $project->github_linked_by ? User::find($project->github_linked_by) : null;
        $token = $linkedUser?->github_token;

        if (!$token) {
            return response()->json([
                'error' => 'GitHub access lost. The user who linked this repo needs to reconnect.',
                'commits' => [],
            ]);
        }

        $cacheKey = "github_commits_{$project->id}";

        $result = Cache::remember($cacheKey, 300, function () use ($project, $token) {
            return $this->fetchCommits($project->github_repo, $token);
        });

        return response()->json($result);
    }

    private function fetchCommits(string $repo, string $token): array
    {
        try {
            $response = Http::withToken($token)
                ->withHeaders([
                    'Accept' => 'application/vnd.github.v3+json',
                    'User-Agent' => 'NA-Innovations-Platform',
                ])
                ->get("https://api.github.com/repos/{$repo}/commits", [
                    'per_page' => 20,
                ]);

            if ($response->status() === 401) {
                return [
                    'error' => 'GitHub token expired. The user who linked this repo needs to reconnect.',
                    'commits' => [],
                ];
            }

            if (!$response->successful()) {
                return ['error' => 'Could not fetch commits from GitHub', 'commits' => []];
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
