<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\ReferralPartner;
use Illuminate\Http\Request;

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

        return view('admin.commissions.index', compact('commissions', 'partners'));
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
        ]);

        return view('admin.commissions.show', compact('commission'));
    }

    /**
     * Confirm the commission.
     */
    public function confirm(Commission $commission)
    {
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
        $validated = $request->validate([
            'paid_date' => 'nullable|date',
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $commission->update([
            'paid_date' => $validated['paid_date'] ?? now()->toDateString(),
            'payment_reference' => $validated['payment_reference'] ?? null,
            'status' => 'paid',
        ]);

        return redirect()->back()->with('success', 'Commission marked as paid.');
    }

    /**
     * Cancel the commission (soft delete).
     */
    public function destroy(Commission $commission)
    {
        $commission->update(['status' => 'cancelled']);
        $commission->delete();

        return redirect()->route('admin.commissions.index')->with('success', 'Commission cancelled.');
    }
}
