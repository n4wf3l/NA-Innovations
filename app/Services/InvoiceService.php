<?php
namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;

class InvoiceService
{
    public static function recordPayment(Invoice $invoice, array $data): Payment
    {
        $payment = $invoice->payments()->create([
            'client_id' => $invoice->client_id,
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? $invoice->currency,
            'method' => $data['method'] ?? 'bank_transfer',
            'reference' => $data['reference'] ?? null,
            'notes' => $data['notes'] ?? null,
            'payment_date' => $data['payment_date'] ?? now()->toDateString(),
            'status' => $data['status'] ?? 'confirmed',
        ]);

        self::recalculateAmounts($invoice);

        return $payment;
    }

    public static function recalculateAmounts(Invoice $invoice): void
    {
        $totalPaid = $invoice->payments()->where('status', 'confirmed')->sum('amount');
        $amountDue = $invoice->total - $totalPaid;

        $status = $invoice->status;
        if ($totalPaid >= $invoice->total) {
            $status = 'paid';
        } elseif ($totalPaid > 0) {
            $status = 'partially_paid';
        }

        $invoice->update([
            'amount_paid' => round($totalPaid, 2),
            'amount_due' => round(max(0, $amountDue), 2),
            'status' => $status,
            'paid_at' => $status === 'paid' ? now() : $invoice->paid_at,
        ]);
    }
}
