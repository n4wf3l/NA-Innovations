<?php

namespace App\Http\Controllers\Admin;

use App\Models\ReferralPartner;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PartnerController extends BaseAdminController
{
    /**
     * Display a listing of referral partners.
     */
    public function index(Request $request)
    {
        $query = ReferralPartner::with('user')->withCount(['leads', 'commissions']);

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $partners = $query->latest()->paginate(15)->withQueryString();

        $totalPartners = ReferralPartner::count();
        $activePartners = ReferralPartner::where('is_active', true)->count();
        $totalCommissionsPaid = \App\Models\Commission::where('status', 'paid')->sum('commission_amount');
        $totalLeadsReferred = \App\Models\Lead::whereNotNull('referral_partner_id')->count();

        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
            'totalPartners' => $totalPartners,
            'activePartners' => $activePartners,
            'totalCommissionsPaid' => $totalCommissionsPaid,
            'totalLeadsReferred' => $totalLeadsReferred,
        ]);
    }

    /**
     * Show the form for creating a new partner.
     */
    public function create()
    {
        return Inertia::render('Admin/Partners/Create');
    }

    /**
     * Store a newly created referral partner.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'default_commission_rate' => 'nullable|numeric|min:0|max:100',
            'payment_method' => 'nullable|in:bank_transfer,paypal',
            'bank_iban' => 'nullable|string|max:50',
            'paypal_email' => 'nullable|email|max:255',
            'notes' => 'nullable|string',
            'financial_pin' => 'nullable|string|min:4|max:6',
        ]);

        // Create user with referral_partner role
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(16)),
            'role' => 'referral_partner',
            // Rattache au tenant de l'admin courant pour visibilité dans /admin/partners
            'admin_id' => auth()->id(),
        ]);

        // Set financial PIN if provided
        if ($request->filled('financial_pin')) {
            $user->update(['financial_pin' => Hash::make($request->financial_pin)]);
        }

        // Generate unique referral code
        do {
            $code = strtoupper(Str::random(8));
        } while (ReferralPartner::where('referral_code', $code)->exists());

        // Create referral partner
        ReferralPartner::create([
            'user_id' => $user->id,
            'referral_code' => $code,
            'default_commission_rate' => $validated['default_commission_rate'] ?? 10.00,
            'payment_method' => $validated['payment_method'] ?? 'bank_transfer',
            'bank_iban' => $validated['bank_iban'],
            'paypal_email' => $validated['paypal_email'],
            'notes' => $validated['notes'],
            'is_active' => true,
        ]);

        return redirect()->route('admin.partners.index')->with('success', 'Partner created successfully.');
    }

    /**
     * Display the specified partner.
     */
    public function show(ReferralPartner $partner)
    {
        $partner->load([
            'user',
            'leads' => function ($query) {
                $query->latest()->limit(10);
            },
            'commissions' => function ($query) {
                $query->latest();
            },
        ]);

        // Calculate totals
        $totalLeads = $partner->leads()->count();
        $wonLeads = $partner->leads()->where('status', 'won')->count();
        $conversionRate = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0;

        $totalCommissionEstimated = $partner->commissions()->where('status', 'estimated')->sum('commission_amount');
        $totalCommissionConfirmed = $partner->commissions()->where('status', 'confirmed')->sum('commission_amount');
        $totalCommissionPaid = $partner->commissions()->where('status', 'paid')->sum('commission_amount');

        return Inertia::render('Admin/Partners/Show', [
            'partner' => $partner,
            'totalLeads' => $totalLeads,
            'wonLeads' => $wonLeads,
            'conversionRate' => $conversionRate,
            'totalCommissionEstimated' => $totalCommissionEstimated,
            'totalCommissionConfirmed' => $totalCommissionConfirmed,
            'totalCommissionPaid' => $totalCommissionPaid,
        ]);
    }

    /**
     * Show the form for editing the specified partner.
     */
    public function edit(ReferralPartner $partner)
    {
        $partner->load('user');

        return Inertia::render('Admin/Partners/Edit', [
            'partner' => $partner,
        ]);
    }

    /**
     * Update the specified partner and associated user.
     */
    public function update(Request $request, ReferralPartner $partner)
    {
        $partner->load('user');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $partner->user->id,
            'default_commission_rate' => 'nullable|numeric|min:0|max:100',
            'payment_method' => 'nullable|in:bank_transfer,paypal',
            'bank_iban' => 'nullable|string|max:50',
            'paypal_email' => 'nullable|email|max:255',
            'notes' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'financial_pin' => 'nullable|string|min:4|max:6',
        ]);

        // Update user fields
        $partner->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Update financial PIN if provided
        if ($request->filled('financial_pin')) {
            $partner->user->update(['financial_pin' => Hash::make($request->financial_pin)]);
        }

        // Update partner fields
        $partner->update([
            'default_commission_rate' => $validated['default_commission_rate'] ?? $partner->default_commission_rate,
            'payment_method' => $validated['payment_method'] ?? $partner->payment_method,
            'bank_iban' => $validated['bank_iban'],
            'paypal_email' => $validated['paypal_email'],
            'notes' => $validated['notes'],
            'is_active' => $request->has('is_active') ? $validated['is_active'] : $partner->is_active,
        ]);

        return redirect()->route('admin.partners.index')->with('success', 'Partner updated successfully.');
    }

    /**
     * Soft delete the partner and deactivate user.
     */
    public function destroy(ReferralPartner $partner)
    {
        $partner->load('user');

        // Deactivate user
        $partner->user->update(['is_active' => false]);

        // Soft delete partner
        $partner->delete();

        return redirect()->route('admin.partners.index')->with('success', 'Partner deleted successfully.');
    }
}
