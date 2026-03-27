<?php

namespace App\Http\Controllers\Admin;

use App\Models\ReferralPartner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends BaseAdminController
{
    /**
     * Display the team management page.
     */
    public function index()
    {
        // All members per role (active + deactivated)
        $partners = User::where('role', 'referral_partner')->with('referralPartner')->orderByDesc('is_active')->get();
        $developers = User::where('role', 'developer')->orderByDesc('is_active')->get();
        $admins = User::where('role', 'admin')->orderByDesc('is_active')->get();

        // Only truly new registrations (never approved = never logged in)
        $pending = User::where('is_active', false)->whereNull('last_login_at')->latest()->get();

        return Inertia::render('Admin/Team/Index', compact('partners', 'developers', 'admins', 'pending'));
    }

    /**
     * Approve a pending user.
     */
    public function approve(User $user)
    {
        $user->update(['is_active' => true, 'last_login_at' => now()]);

        // Create ReferralPartner record if partner
        if ($user->role === 'referral_partner' && !$user->referralPartner) {
            ReferralPartner::create([
                'user_id' => $user->id,
                'referral_code' => strtoupper(Str::random(8)),
                'default_commission_rate' => 10,
                'payment_method' => 'bank_transfer',
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', "{$user->name} has been approved.");
    }

    /**
     * Reject a pending user (delete).
     */
    public function reject(User $user)
    {
        $user->forceDelete();

        return redirect()->back()->with('success', 'Registration rejected and removed.');
    }

    /**
     * Admin creates an account directly (already active).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:admin,developer,referral_partner',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => $validated['password'],
            'is_active' => true,
        ]);

        if ($user->role === 'referral_partner') {
            ReferralPartner::create([
                'user_id' => $user->id,
                'referral_code' => strtoupper(Str::random(8)),
                'default_commission_rate' => 10,
                'payment_method' => 'bank_transfer',
                'is_active' => true,
            ]);
        }

        return redirect()->back()->with('success', "{$user->name} account created.");
    }

    /**
     * Toggle a user's active status.
     */
    public function toggleActive(User $user)
    {
        $newActive = !$user->is_active;
        $data = ['is_active' => $newActive];

        // Ensure deactivated users never appear in pending approvals
        if (!$newActive && is_null($user->last_login_at)) {
            $data['last_login_at'] = now();
        }

        $user->update($data);

        return redirect()->back()->with('success', $newActive ? 'Account activated.' : 'Account deactivated.');
    }
}
