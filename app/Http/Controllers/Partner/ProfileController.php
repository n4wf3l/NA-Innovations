<?php

namespace App\Http\Controllers\Partner;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $partner = $user->referralPartner;

        if (!$partner) abort(403);

        return Inertia::render('Partner/Profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'preferences' => $user->preferences ?? [
                    'email_notifications' => true,
                    'name_display' => 'full',
                    'currency' => 'EUR',
                    'privacy_full_name' => true,
                ],
            ],
            'partner' => [
                'referral_code' => $partner->referral_code,
                'referral_link' => $partner->referral_link,
                'default_commission_rate' => $partner->default_commission_rate,
                'payment_method' => $partner->payment_method,
                'bank_iban' => $partner->bank_iban,
                'paypal_email' => $partner->paypal_email,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $partner = $user->referralPartner;

        if (!$partner) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'payment_method' => 'required|in:bank_transfer,paypal,cash,other',
            'bank_iban' => 'nullable|string|max:34',
            'paypal_email' => 'nullable|email|max:255',
            // Preferences
            'preferences.email_notifications' => 'boolean',
            'preferences.name_display' => 'required|in:full,abbreviated',
            'preferences.currency' => 'required|in:EUR,USD,GBP,PKR,BDT,INR,MAD',
            'preferences.privacy_full_name' => 'boolean',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'preferences' => $validated['preferences'],
        ]);

        $partner->update([
            'payment_method' => $validated['payment_method'],
            'bank_iban' => $validated['bank_iban'] ?? null,
            'paypal_email' => $validated['paypal_email'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Profile and settings updated successfully.');
    }
}
