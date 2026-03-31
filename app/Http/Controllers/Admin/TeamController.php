<?php

namespace App\Http\Controllers\Admin;

use App\Models\ReferralPartner;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamController extends BaseAdminController
{
    /**
     * Display the team management page.
     */
    public function index()
    {
        $partners = User::where('role', 'referral_partner')->with('referralPartner')->orderByDesc('is_active')->get();
        $developers = User::where('role', 'developer')->orderByDesc('is_active')->get();
        $admins = User::where('role', 'admin')->orderByDesc('is_active')->get();

        // Pending = inactive + never approved
        $pending = User::where('is_active', false)->whereNull('approved_at')->latest()->get();

        return Inertia::render('Admin/Team/Index', compact('partners', 'developers', 'admins', 'pending'));
    }

    /**
     * Approve a pending user.
     */
    public function approve(User $user)
    {
        $user->update([
            'is_active' => true,
            'approved_at' => now(),
        ]);

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

        // Notify the user their account is approved
        NotificationService::send($user, 'account-approved', [
            'user_name' => $user->name,
            'portal_url' => url('/login'),
        ], transactional: true);

        \Illuminate\Support\Facades\Cache::forget('team_counts');

        return redirect()->back()->with('success', "{$user->name} has been approved.");
    }

    /**
     * Reject a pending user — soft delete + notify.
     */
    public function reject(User $user)
    {
        // Notify before deleting (need email to send)
        NotificationService::send($user, 'account-rejected', [
            'user_name' => $user->name,
        ], transactional: true);

        // Soft delete instead of force delete — keep trace
        $user->update(['approved_at' => now()]); // mark as "processed" so it doesn't reappear in pending
        $user->delete();

        return redirect()->back()->with('success', 'Registration rejected.');
    }

    /**
     * Approve knowledge base access for a partner.
     */
    public function approveKbAccess(User $user)
    {
        $partner = $user->referralPartner;
        if (!$partner || $partner->kb_access_status !== 'pending') {
            return redirect()->back()->with('error', 'Aucune demande en attente.');
        }

        $partner->update([
            'kb_access_status' => 'approved',
            'kb_access_granted_at' => now(),
            'kb_access_granted_by' => auth()->id(),
        ]);

        NotificationService::send($user, 'account-approved', [
            'user_name' => $user->name,
        ]);

        return redirect()->back()->with('success', 'Accès à la Knowledge Base accordé à ' . $user->name . '.');
    }

    /**
     * Reject knowledge base access for a partner.
     */
    public function rejectKbAccess(User $user)
    {
        $partner = $user->referralPartner;
        if (!$partner || $partner->kb_access_status !== 'pending') {
            return redirect()->back()->with('error', 'Aucune demande en attente.');
        }

        $partner->update([
            'kb_access_status' => 'rejected',
        ]);

        return redirect()->back()->with('success', 'Demande d\'accès refusée.');
    }

    /**
     * Admin creates an account directly.
     * No password in the form — user sets their own via reset link.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:admin,developer,referral_partner',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => bcrypt(Str::random(32)), // random password — user will set their own
            'is_active' => true,
            'approved_at' => now(),
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

        // Send welcome email with password reset link
        NotificationService::send($user, 'client-welcome', [
            'client_name' => $user->name,
            'email' => $user->email,
            'portal_url' => url('/login'),
        ], transactional: true);

        // Send password reset link so user can set their own password
        try {
            Password::sendResetLink(['email' => $user->email]);
        } catch (\Exception $e) {
            // Don't fail if email can't be sent
        }

        \Illuminate\Support\Facades\Cache::forget('team_counts');

        return redirect()->back()->with('success', "{$user->name} account created. A password setup email has been sent.");
    }

    /**
     * Toggle a user's active status.
     */
    public function toggleActive(User $user)
    {
        $newActive = !$user->is_active;
        $data = ['is_active' => $newActive];

        // Ensure deactivated users don't appear in pending
        if (!$newActive && is_null($user->approved_at)) {
            $data['approved_at'] = now();
        }

        $user->update($data);

        \Illuminate\Support\Facades\Cache::forget('team_counts');

        return redirect()->back()->with('success', $newActive ? 'Account activated.' : 'Account deactivated.');
    }
}
