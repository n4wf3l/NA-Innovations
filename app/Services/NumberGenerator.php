<?php
namespace App\Services;

use App\Models\Quote;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class NumberGenerator
{
    public static function generateQuoteNumber(): string
    {
        return DB::transaction(function () {
            $prefix = Setting::get('quote.prefix', 'DEV');
            $year = now()->format('Y');
            $pattern = sprintf('%s-%s-', $prefix, $year);

            // Get the highest existing number in DB
            $maxInDb = Quote::where('quote_number', 'like', $pattern . '%')
                ->selectRaw("MAX(CAST(SUBSTRING(quote_number, ?) AS UNSIGNED)) as max_num", [strlen($pattern) + 1])
                ->value('max_num') ?? 0;

            // Get the counter from settings
            $fromSetting = (int) Setting::get('quote.next_number', 1);

            // Use whichever is higher + 1
            $nextNumber = max($maxInDb + 1, $fromSetting);

            Setting::set('quote.next_number', $nextNumber + 1);

            return sprintf('%s-%s-%03d', $prefix, $year, $nextNumber);
        });
    }

    public static function generateInvoiceNumber(): string
    {
        return DB::transaction(function () {
            $prefix = Setting::get('invoice.prefix', 'FAC');
            $year = now()->format('Y');
            $pattern = sprintf('%s-%s-', $prefix, $year);

            $maxInDb = Invoice::where('invoice_number', 'like', $pattern . '%')
                ->selectRaw("MAX(CAST(SUBSTRING(invoice_number, ?) AS UNSIGNED)) as max_num", [strlen($pattern) + 1])
                ->value('max_num') ?? 0;

            $fromSetting = (int) Setting::get('invoice.next_number', 1);

            $nextNumber = max($maxInDb + 1, $fromSetting);

            Setting::set('invoice.next_number', $nextNumber + 1);

            return sprintf('%s-%s-%03d', $prefix, $year, $nextNumber);
        });
    }
}
