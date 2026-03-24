<?php
namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class NumberGenerator
{
    public static function generateQuoteNumber(): string
    {
        return DB::transaction(function () {
            $prefix = Setting::get('quote.prefix', 'DEV');
            $year = now()->format('Y');
            $nextNumber = (int) Setting::get('quote.next_number', 1);

            Setting::set('quote.next_number', $nextNumber + 1);

            return sprintf('%s-%s-%03d', $prefix, $year, $nextNumber);
        });
    }

    public static function generateInvoiceNumber(): string
    {
        return DB::transaction(function () {
            $prefix = Setting::get('invoice.prefix', 'FAC');
            $year = now()->format('Y');
            $nextNumber = (int) Setting::get('invoice.next_number', 1);

            Setting::set('invoice.next_number', $nextNumber + 1);

            return sprintf('%s-%s-%03d', $prefix, $year, $nextNumber);
        });
    }
}
