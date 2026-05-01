<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\ReferralPartner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionController extends BaseAdminController
{
    /**
     * Display a listing of commissions with filters.
     */
    public function index(Request $request)
    {
        $query = Commission::with('referralPartner.user', 'lead', 'invoice');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by partner
        if ($request->filled('partner_id')) {
            $query->where('referral_partner_id', $request->partner_id);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('referralPartner.user', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('lead', function ($q2) use ($search) {
                    $q2->where('first_name', 'like', "%{$search}%")
                       ->orWhere('last_name', 'like', "%{$search}%");
                });
            });
        }

        $commissions = $query->latest()->paginate(15)->withQueryString();
        $partners = ReferralPartner::with('user')->get();

        $totalCommissions = Commission::count();
        $totalPending = Commission::whereIn('status', ['estimated', 'confirmed', 'scheduled'])->sum('commission_amount');
        $totalPaid = Commission::where('status', 'paid')->sum('commission_amount');
        $totalBlocked = Commission::where('status', 'blocked')->sum('commission_amount');
        $totalAmount = Commission::sum('commission_amount');

        $unlocked = $this->financialUnlocked();

        return Inertia::render('Admin/Commissions/Index', [
            'commissions' => $commissions,
            'partners' => $partners,
            'totalCommissions' => $totalCommissions,
            'totalPending' => $unlocked ? $totalPending : 0,
            'totalPaid' => $unlocked ? $totalPaid : 0,
            'totalBlocked' => $unlocked ? $totalBlocked : 0,
            'totalAmount' => $unlocked ? $totalAmount : 0,
        ]);
    }

    /**
     * Display the specified commission.
     */
    public function show(Commission $commission)
    {
        $commission->load([
            'referralPartner.user',
            'lead',
            'client',
            'projet',
            'invoice',
            'blockedBy:id,name',
        ]);

        if (!$this->financialUnlocked()) {
            $commission->base_amount = 0;
            $commission->commission_amount = 0;
            $commission->commission_rate = 0;
            if ($commission->invoice) {
                foreach (['subtotal', 'tax_amount', 'total', 'amount_paid', 'amount_due'] as $f) {
                    if (isset($commission->invoice->$f)) $commission->invoice->$f = 0;
                }
            }
        }

        return Inertia::render('Admin/Commissions/Show', [
            'commission' => $commission,
        ]);
    }

    /**
     * Confirm the commission.
     */
    public function confirm(Commission $commission)
    {
        if (in_array($commission->status, ['confirmed', 'scheduled', 'paid'])) {
            return redirect()->back()->with('error', "Cannot confirm a commission with status '{$commission->status}'.");
        }

        $commission->update(['status' => 'confirmed']);

        return redirect()->back()->with('success', 'Commission confirmed.');
    }

    /**
     * Schedule the commission payment.
     */
    public function schedule(Request $request, Commission $commission)
    {
        $validated = $request->validate([
            'scheduled_payment_date' => 'required|date',
        ]);

        $commission->update([
            'scheduled_payment_date' => $validated['scheduled_payment_date'],
            'status' => 'scheduled',
        ]);

        return redirect()->back()->with('success', 'Commission payment scheduled.');
    }

    /**
     * Mark commission as paid.
     */
    public function pay(Request $request, Commission $commission)
    {
        if ($commission->status === 'blocked') {
            return redirect()->back()->with('error', __('Cette commission est bloquée. Débloquez-la avant de la payer.'));
        }

        if (!in_array($commission->status, ['scheduled', 'confirmed'])) {
            return redirect()->back()->with('error', $commission->status === 'paid'
                ? 'This commission has already been paid.'
                : "Cannot pay a commission with status '{$commission->status}'.");
        }

        $validated = $request->validate([
            'paid_date' => 'nullable|date',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $commission->update([
            'paid_date' => $validated['paid_date'] ?? now()->toDateString(),
            'payment_reference' => $validated['payment_reference'] ?? null,
            'status' => 'paid',
        ]);

        // Notify partner (in-app + email)
        $commission->load('referralPartner.user');
        $partner = $commission->referralPartner;
        if ($partner && $partner->user) {
            // In-app notification
            \App\Models\NotificationLog::create([
                'user_id' => $partner->user->id,
                'type' => 'commission_paid',
                'title' => 'Commission payée',
                'message' => "Votre commission de " . number_format($commission->commission_amount, 2, ',', '.') . " EUR a été payée." . ($commission->payment_reference ? " Référence : {$commission->payment_reference}" : ''),
                'action_url' => '/partner/commissions',
                'is_read' => false,
            ]);

            // Email notification (prepared for when mail driver is active)
            \App\Services\WorkflowService::notifyPartnerByEmailPublic($partner->user, 'commission-paid', [
                'partner_name' => $partner->user->name,
                'commission_amount' => number_format($commission->commission_amount, 2, ',', '.'),
                'payment_reference' => $commission->payment_reference ?? 'N/A',
            ]);
        }

        return redirect()->back()->with('success', 'Commission marquée comme payée.');
    }

    /**
     * Block the commission (prevent payment until unblocked).
     */
    public function block(Request $request, Commission $commission)
    {
        if ($commission->status === 'paid') {
            return redirect()->back()->with('error', __('Impossible de bloquer une commission déjà payée.'));
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $commission->update([
            'status' => 'blocked',
            'blocked_reason' => $validated['reason'],
            'blocked_at' => now(),
            'blocked_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', __('Commission bloquée.'));
    }

    /**
     * Unblock the commission — returns to 'confirmed' status.
     */
    public function unblock(Commission $commission)
    {
        if ($commission->status !== 'blocked') {
            return redirect()->back()->with('error', __('Cette commission n\'est pas bloquée.'));
        }

        $commission->update([
            'status' => 'confirmed',
            'blocked_reason' => null,
            'blocked_at' => null,
            'blocked_by' => null,
        ]);

        return redirect()->back()->with('success', __('Commission débloquée.'));
    }

    /**
     * Cancel the commission (soft delete).
     */
    public function destroy(Commission $commission)
    {
        if ($commission->status === 'paid') {
            return redirect()->back()->with('error', 'Cannot cancel a commission that has already been paid.');
        }

        $commission->update(['status' => 'cancelled']);
        $commission->delete();

        return redirect()->route('admin.commissions.index')->with('success', 'Commission cancelled.');
    }
}
