<?php

namespace App\Http\Controllers\Dev;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function index()
    {
        if (Setting::get('dev.show_team_contacts', '1') !== '1') {
            return redirect()->route('dev.dashboard')->with('error', __('Section non disponible.'));
        }

        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $admins = User::where('role', 'admin')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'avatar']);

        return Inertia::render('Dev/Team', [
            'admins' => $admins,
        ]);
    }
}
