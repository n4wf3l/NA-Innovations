<?php
namespace App\Services;

use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Support\Str;

class QuoteService
{
    public static function create(array $data, array $items = []): Quote
    {
        $data['quote_number'] = NumberGenerator::generateQuoteNumber();
        $data['view_token'] = Str::random(64);
        $data['issue_date'] = $data['issue_date'] ?? now()->toDateString();
        $data['valid_until'] = $data['valid_until'] ?? now()->addDays(
            (int) Setting::get('quote.default_validity_days', 30)
        )->toDateString();
        $data['deposit_percentage'] = $data['deposit_percentage'] ?? (int) Setting::get('quote.default_deposit_percentage', 30);
        $data['tax_rate'] = $data['tax_rate'] ?? (float) Setting::get('invoice.default_tax_rate', 21.00);

        $quote = Quote::create($data);

        if (!empty($items)) {
            self::syncItems($quote, $items);
        }

        self::recalculate($quote);

        return $quote;
    }

    public static function syncItems(Quote $quote, array $items): void
    {
        $quote->items()->delete();

        foreach ($items as $index => $item) {
            $total = ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
            $quote->items()->create([
                'section' => $item['section'] ?? null,
                'description' => $item['description'],
                'details' => $item['details'] ?? null,
                'quantity' => $item['quantity'] ?? 1,
                'unit' => $item['unit'] ?? 'unit',
                'unit_price' => $item['unit_price'] ?? 0,
                'total' => $total,
                'is_optional' => filter_var($item['is_optional'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'sort_order' => $item['sort_order'] ?? $index,
            ]);
        }

        self::recalculate($quote);
    }

    public static function recalculate(Quote $quote): Quote
    {
        $quote->load('items');

        // Only sum non-optional items
        $subtotal = $quote->items->where('is_optional', false)->sum('total');

        // Discount
        $discountAmount = 0;
        if ($quote->discount_type === 'percentage' && $quote->discount_value) {
            $discountAmount = $subtotal * (floatval($quote->discount_value) / 100);
        } else {
            $discountAmount = floatval($quote->discount_value ?? 0);
        }

        $afterDiscount = $subtotal - $discountAmount;
        $taxAmount = $afterDiscount * ($quote->tax_rate / 100);
        $total = $afterDiscount + $taxAmount;
        $depositAmount = $total * ($quote->deposit_percentage / 100);

        $quote->update([
            'subtotal' => round($subtotal, 2),
            'discount_amount' => round($discountAmount, 2),
            'tax_amount' => round($taxAmount, 2),
            'total' => round($total, 2),
            'deposit_amount' => round($depositAmount, 2),
        ]);

        return $quote->fresh();
    }

    public static function duplicate(Quote $quote): Quote
    {
        $newQuote = $quote->replicate([
            'quote_number', 'status', 'view_token', 'sent_at', 'viewed_at',
            'accepted_at', 'rejected_at', 'rejection_reason', 'pdf_path',
        ]);
        $newQuote->quote_number = NumberGenerator::generateQuoteNumber();
        $newQuote->view_token = Str::random(64);
        $newQuote->status = 'draft';
        $newQuote->issue_date = now()->toDateString();
        $newQuote->valid_until = now()->addDays(
            (int) Setting::get('quote.default_validity_days', 30)
        )->toDateString();
        $newQuote->save();

        foreach ($quote->items as $item) {
            $newItem = $item->replicate();
            $newItem->quote_id = $newQuote->id;
            $newItem->save();
        }

        return $newQuote;
    }

    public static function convertToInvoice(Quote $quote, string $type = 'deposit'): Invoice
    {
        if ($type === 'deposit' && $quote->deposit_amount <= 0) {
            throw new \InvalidArgumentException('Cannot create deposit invoice: deposit amount is 0.');
        }

        $invoiceData = [
            'invoice_number' => NumberGenerator::generateInvoiceNumber(),
            'quote_id' => $quote->id,
            'client_id' => $quote->client_id,
            'projet_id' => $quote->projet_id,
            'client_name' => $quote->client_name,
            'client_email' => $quote->client_email,
            'client_company' => $quote->client_company,
            'client_address' => $quote->client_address,
            'client_vat' => $quote->client_vat,
            'type' => $type,
            'tax_rate' => $quote->tax_rate,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays((int) Setting::get('invoice.payment_terms_days', 30))->toDateString(),
            'view_token' => Str::random(64),
            'status' => 'draft',
        ];

        if ($type === 'deposit') {
            $invoiceData['title'] = "Deposit Invoice - {$quote->title}";
            $subtotal = $quote->deposit_amount / (1 + $quote->tax_rate / 100);
            $taxAmount = $quote->deposit_amount - $subtotal;
            $invoiceData['subtotal'] = round($subtotal, 2);
            $invoiceData['tax_amount'] = round($taxAmount, 2);
            $invoiceData['total'] = $quote->deposit_amount;
            $invoiceData['amount_due'] = $quote->deposit_amount;
        } else {
            // Final invoice: deduct any deposit already invoiced
            $depositAlreadyInvoiced = Invoice::where('quote_id', $quote->id)
                ->where('type', 'deposit')
                ->whereNotIn('status', ['cancelled'])
                ->sum('total');

            $finalTotal = $quote->total - $depositAlreadyInvoiced;
            $finalSubtotal = $finalTotal / (1 + $quote->tax_rate / 100);
            $finalTax = $finalTotal - $finalSubtotal;

            $invoiceData['title'] = $depositAlreadyInvoiced > 0
                ? "Final Invoice - {$quote->title}"
                : "Invoice - {$quote->title}";
            $invoiceData['subtotal'] = round($finalSubtotal, 2);
            $invoiceData['tax_amount'] = round($finalTax, 2);
            $invoiceData['total'] = round($finalTotal, 2);
            $invoiceData['amount_due'] = round($finalTotal, 2);
        }

        $invoice = Invoice::create($invoiceData);

        // Create invoice items
        if ($type === 'deposit') {
            $invoice->items()->create([
                'description' => "Deposit ({$quote->deposit_percentage}%) - {$quote->title}",
                'quantity' => 1,
                'unit' => 'forfait',
                'unit_price' => $invoiceData['subtotal'],
                'total' => $invoiceData['subtotal'],
                'sort_order' => 0,
            ]);
        } else {
            // Add each quote line item
            foreach ($quote->items->where('is_optional', false) as $index => $item) {
                $invoice->items()->create([
                    'description' => $item->description,
                    'details' => $item->details,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                    'sort_order' => $index,
                ]);
            }

            // Add a negative line for the deposit already paid
            $depositAlreadyInvoiced = Invoice::where('quote_id', $quote->id)
                ->where('type', 'deposit')
                ->whereNotIn('status', ['cancelled'])
                ->sum('total');

            if ($depositAlreadyInvoiced > 0) {
                $depositSubtotal = $depositAlreadyInvoiced / (1 + $quote->tax_rate / 100);
                $invoice->items()->create([
                    'description' => "Less: Deposit already invoiced ({$quote->deposit_percentage}%)",
                    'quantity' => 1,
                    'unit' => 'forfait',
                    'unit_price' => -round($depositSubtotal, 2),
                    'total' => -round($depositSubtotal, 2),
                    'sort_order' => 999,
                ]);
            }
        }

        return $invoice;
    }
}
