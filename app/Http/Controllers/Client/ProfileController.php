<?php

namespace App\Http\Controllers\Client;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function edit()
    {
        $user = Auth::user();

        // Profile completion score
        $fields = ['name', 'email', 'phone', 'company_name', 'address', 'city', 'postal_code', 'country'];
        $filled = collect($fields)->filter(fn($f) => !empty($user->$f))->count();
        $completion = round(($filled / count($fields)) * 100);

        return Inertia::render('Client/Profile', [
            'user' => $user,
            'completion' => $completion,
            'lastLogin' => $user->last_login_at?->diffForHumans(),
            'memberSince' => $user->created_at?->format('d/m/Y'),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'Profile updated.');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = Auth::user();

        // Delete old avatar
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return redirect()->back()->with('success', 'Avatar updated.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        $user->update(['password' => $request->password]);

        return redirect()->back()->with('success', 'Password updated.');
    }

    public function updateNotifications(Request $request)
    {
        $user = Auth::user();

        $prefs = $user->preferences ?? [];
        $prefs['notifications'] = [
            'notify_project_updates' => $request->boolean('notify_project_updates', true),
            'notify_service_expiry' => $request->boolean('notify_service_expiry', true),
        ];

        $user->update(['preferences' => $prefs]);

        return redirect()->back()->with('success', 'Notification preferences updated.');
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'confirmation' => 'required|in:DELETE',
        ]);

        $user = Auth::user();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $user->delete(); // soft delete

        return redirect('/login')->with('success', 'Your account has been deleted.');
    }
}
