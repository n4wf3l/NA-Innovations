<?php
namespace App\Services;

use App\Models\Quote;
use App\Models\Invoice;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PdfService
{
    public static function generateQuotePdf(Quote $quote): string
    {
        $quote->load('items');
        $company = self::getCompanyInfo();

        $pdf = Pdf::loadView('pdf.quote', compact('quote', 'company'));
        $pdf->setPaper('a4');

        $path = "quotes/{$quote->quote_number}.pdf";
        Storage::disk('local')->put($path, $pdf->output());

        $quote->update(['pdf_path' => $path]);

        return $path;
    }

    public static function generateInvoicePdf(Invoice $invoice): string
    {
        $invoice->load('items');
        $company = self::getCompanyInfo();

        $pdf = Pdf::loadView('pdf.invoice', compact('invoice', 'company'));
        $pdf->setPaper('a4');

        $path = "invoices/{$invoice->invoice_number}.pdf";
        Storage::disk('local')->put($path, $pdf->output());

        $invoice->update(['pdf_path' => $path]);

        return $path;
    }

    private static function getCompanyInfo(): array
    {
        return [
            'name' => Setting::get('company.name', 'NA Innovations'),
            'email' => Setting::get('company.email', 'info@nawfelajari.be'),
            'phone' => Setting::get('company.phone', ''),
            'address' => Setting::get('company.address', '170 Nijverheidskaai, Anderlecht'),
            'vat' => Setting::get('company.vat', ''),
            'country' => Setting::get('company.country', 'Belgium'),
            'bank_name' => Setting::get('invoice.bank_name', ''),
            'bank_iban' => Setting::get('invoice.bank_iban', ''),
            'bank_bic' => Setting::get('invoice.bank_bic', ''),
        ];
    }
}
