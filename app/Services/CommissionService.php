<?php
namespace App\Services;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;

class CommissionService
{
    public static function calculateForPayment(Payment $payment): ?Commission
    {
        $invoice = $payment->invoice;
        if (!$invoice) return null;

        // Find the lead that generated this project/client
        $lead = null;
        if ($invoice->projet_id) {
            $lead = Lead::where('converted_client_id', $invoice->client_id)
                ->whereNotNull('referral_partner_id')
                ->first();
        }

        if (!$lead || !$lead->referral_partner_id) return null;

        $partner = $lead->referralPartner;
        if (!$partner) return null;

        $commissionRate = $partner->default_commission_rate;
        // Calculate on HT amount (before tax)
        $baseAmount = $payment->amount / (1 + ($invoice->tax_rate / 100));
        $commissionAmount = $baseAmount * ($commissionRate / 100);

        return Commission::create([
            'referral_partner_id' => $partner->id,
            'lead_id' => $lead->id,
            'client_id' => $invoice->client_id,
            'projet_id' => $invoice->projet_id,
            'invoice_id' => $invoice->id,
            'base_amount' => round($baseAmount, 2),
            'commission_rate' => $commissionRate,
            'commission_amount' => round($commissionAmount, 2),
            'status' => 'estimated',
        ]);
    }
}
