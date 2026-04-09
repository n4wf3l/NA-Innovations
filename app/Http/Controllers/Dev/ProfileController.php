<?php

namespace App\Http\Controllers\Dev;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = auth()->user();
        return Inertia::render('Dev/Profile', [
            'user' => $user,
            'devSettings' => [
                'showHourlyRate' => \App\Models\Setting::get('dev.show_hourly_rate', '1') === '1',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'bio' => 'nullable|string|max:2000',
            'skills' => 'nullable|array',
            'skills.*' => 'string|max:50',
            'specialties' => 'nullable|array',
            'specialties.*' => 'string|max:50',
        ]);

        $user->update($validated);
        return redirect()->back()->with('success', __('Profil mis à jour.'));
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        auth()->user()->update(['password' => Hash::make($request->password)]);
        return redirect()->back()->with('success', 'Password updated.');
    }
}
