<?php
namespace App\Services;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Projet;
use App\Models\Payment;
use App\Models\NotificationLog;

class CommissionService
{
    /**
     * Calculate and create a commission when a payment is recorded.
     *
     * Lookup chain:
     * 1. Invoice → projet → lead (via projet.lead_id)
     * 2. Invoice → quote → lead (via quote.lead_id)
     * 3. Invoice → client → lead (via lead.converted_client_id)
     *
     * Any of these paths that yields a lead with a referral_partner triggers a commission.
     */
    public static function calculateForPayment(Payment $payment): ?Commission
    {
        $invoice = $payment->invoice;
        if (!$invoice) return null;

        // Already has a commission for this payment? Skip.
        $exists = Commission::where('invoice_id', $invoice->id)
            ->whereHas('invoice', fn($q) => $q->whereHas('payments', fn($pq) => $pq->where('id', $payment->id)))
            ->exists();

        $lead = self::findReferralLead($invoice);

        if (!$lead || !$lead->referral_partner_id) return null;

        $partner = $lead->referralPartner;
        if (!$partner || !$partner->is_active) return null;

        $commissionRate = $partner->default_commission_rate;
        // Calculate on HT amount (before tax)
        $taxRate = $invoice->tax_rate ?: 21;
        $baseAmount = $payment->amount / (1 + ($taxRate / 100));
        $commissionAmount = $baseAmount * ($commissionRate / 100);

        $commission = Commission::create([
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

        // Notify the partner
        try {
            if ($partner->user) {
                NotificationLog::create([
                    'user_id' => $partner->user->id,
                    'type' => 'commission_earned',
                    'title' => 'Commission earned',
                    'message' => "You earned a commission of €" . number_format($commissionAmount, 2) . " from payment on {$invoice->invoice_number}",
                    'is_read' => false,
                ]);
            }
        } catch (\Exception $e) {
            // Don't fail the payment if notification fails
        }

        return $commission;
    }

    /**
     * Find the referral lead associated with an invoice.
     * Tries multiple paths to find the link.
     */
    private static function findReferralLead(Invoice $invoice): ?Lead
    {
        // Path 1: Invoice → project → lead
        if ($invoice->projet_id) {
            $project = Projet::find($invoice->projet_id);
            if ($project && $project->lead_id) {
                $lead = Lead::where('id', $project->lead_id)
                    ->whereNotNull('referral_partner_id')
                    ->first();
                if ($lead) return $lead;
            }
        }

        // Path 2: Invoice → quote → lead
        if ($invoice->quote_id) {
            $quote = \App\Models\Quote::find($invoice->quote_id);
            if ($quote && $quote->lead_id) {
                $lead = Lead::where('id', $quote->lead_id)
                    ->whereNotNull('referral_partner_id')
                    ->first();
                if ($lead) return $lead;
            }
        }

        // Path 3: Invoice → client → lead (via converted_client_id)
        if ($invoice->client_id) {
            $lead = Lead::where('converted_client_id', $invoice->client_id)
                ->whereNotNull('referral_partner_id')
                ->first();
            if ($lead) return $lead;
        }

        return null;
    }
}
