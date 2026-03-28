<?php
namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;

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

        $wasPaid = $invoice->status === 'paid';

        self::recalculateAmounts($invoice);

        $invoice->refresh();

        // Send payment confirmation to client
        if ($invoice->client_id) {
            $client = User::find($invoice->client_id);
            if ($client) {
                NotificationService::send(
                    $client,
                    'payment-confirmation',
                    [
                        'client_name' => $invoice->client_name,
                        'invoice_number' => $invoice->invoice_number,
                        'amount' => number_format($payment->amount, 2, ',', '.'),
                        'payment_date' => $payment->payment_date ? date('d/m/Y', strtotime($payment->payment_date)) : now()->format('d/m/Y'),
                        'remaining' => number_format($invoice->amount_due, 2, ',', '.'),
                    ],
                    transactional: true,
                );
            }
        }

        // Trigger workflow if invoice just became fully paid
        if (!$wasPaid && $invoice->status === 'paid') {
            WorkflowService::onInvoiceFullyPaid($invoice);
        }

        return $payment;
    }

    public static function recalculateAmounts(Invoice $invoice): void
    {
        $totalPaid = $invoice->payments()->where('status', 'confirmed')->sum('amount');
        $amountDue = $invoice->total - $totalPaid;

        $status = $invoice->status;
        if ($totalPaid >= $invoice->total) {
            $status = 'paid';
        } elseif ($totalPaid > 0 && !in_array($status, ['overdue'])) {
            $status = 'partially_paid';
        }

        $invoice->update([
            'amount_paid' => round($totalPaid, 2),
            'amount_due' => round(max(0, $amountDue), 2),
            'status' => $status,
            'paid_at' => $status === 'paid' ? ($invoice->paid_at ?? now()) : $invoice->paid_at,
        ]);
    }
}
