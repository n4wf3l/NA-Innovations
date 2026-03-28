<?php

namespace App\Http\Controllers\Auth;

use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GitHubController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Redirect to GitHub OAuth authorization page.
     */
    public function redirect(Request $request)
    {
        $state = Str::random(40);
        $request->session()->put('github_oauth_state', $state);
        $request->session()->put('github_oauth_return', url()->previous());

        $params = http_build_query([
            'client_id' => config('services.github.client_id'),
            'redirect_uri' => config('services.github.redirect'),
            'scope' => 'repo',
            'state' => $state,
        ]);

        return redirect("https://github.com/login/oauth/authorize?{$params}");
    }

    /**
     * Handle GitHub OAuth callback.
     */
    public function callback(Request $request)
    {
        // Verify state
        $storedState = $request->session()->pull('github_oauth_state');
        $returnUrl = $request->session()->pull('github_oauth_return', '/');

        if (!$storedState || $storedState !== $request->input('state')) {
            return redirect($returnUrl)->with('error', 'Invalid OAuth state. Please try again.');
        }

        $code = $request->input('code');
        if (!$code) {
            return redirect($returnUrl)->with('error', 'GitHub authorization was cancelled.');
        }

        // Exchange code for access token
        $tokenResponse = Http::acceptJson()->post('https://github.com/login/oauth/access_token', [
            'client_id' => config('services.github.client_id'),
            'client_secret' => config('services.github.client_secret'),
            'code' => $code,
            'redirect_uri' => config('services.github.redirect'),
        ]);

        if (!$tokenResponse->successful() || !$tokenResponse->json('access_token')) {
            return redirect($returnUrl)->with('error', 'Failed to get GitHub access token.');
        }

        $accessToken = $tokenResponse->json('access_token');

        // Get GitHub username
        $userResponse = Http::withToken($accessToken)
            ->withHeaders(['User-Agent' => 'NA-Innovations-Platform'])
            ->get('https://api.github.com/user');

        if (!$userResponse->successful()) {
            return redirect($returnUrl)->with('error', 'Failed to fetch GitHub profile.');
        }

        $githubUsername = $userResponse->json('login');

        // Store on user (token is encrypted via cast)
        $user = Auth::user();
        $user->update([
            'github_token' => $accessToken,
            'github_username' => $githubUsername,
        ]);

        return redirect($returnUrl)->with('success', "GitHub connected as @{$githubUsername}");
    }

    /**
     * Disconnect GitHub from user account.
     */
    public function disconnect()
    {
        $user = Auth::user();

        // Unlink all projects linked by this user
        Projet::where('github_linked_by', $user->id)->update([
            'github_repo' => null,
            'github_linked_by' => null,
        ]);

        $user->update([
            'github_token' => null,
            'github_username' => null,
        ]);

        return redirect()->back()->with('success', 'GitHub disconnected.');
    }
}
