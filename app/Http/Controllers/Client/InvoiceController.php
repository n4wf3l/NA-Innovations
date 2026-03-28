<?php

namespace App\Http\Controllers\Client;

use App\Models\Invoice;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    private function clientScope()
    {
        $user = Auth::user();
        return fn($q) => $q->where('client_id', $user->id)->orWhere('client_email', $user->email);
    }

    private function canAccess(Invoice $invoice): bool
    {
        $user = Auth::user();
        return $invoice->client_id == $user->id || $invoice->client_email === $user->email;
    }

    public function index()
    {
        $invoices = Invoice::where($this->clientScope())
            ->whereNotIn('status', ['draft'])
            ->with('payments')
            ->latest()
            ->get();

        return Inertia::render('Client/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function show(Invoice $invoice)
    {
        if (!$this->canAccess($invoice)) {
            abort(403);
        }

        $invoice->load(['items', 'payments', 'quote']);

        return Inertia::render('Client/Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function downloadPdf(Invoice $invoice)
    {
        if (!$this->canAccess($invoice)) {
            abort(403);
        }

        if (!$invoice->pdf_path || !Storage::disk('local')->exists($invoice->pdf_path)) {
            \App\Services\PdfService::generateInvoicePdf($invoice);
            $invoice->refresh();
        }

        return Storage::disk('local')->download($invoice->pdf_path, "{$invoice->invoice_number}.pdf");
    }

    public function previewPdf(Invoice $invoice)
    {
        if (!$this->canAccess($invoice)) {
            abort(403);
        }

        if (!$invoice->pdf_path || !Storage::disk('local')->exists($invoice->pdf_path)) {
            \App\Services\PdfService::generateInvoicePdf($invoice);
            $invoice->refresh();
        }

        return response(Storage::disk('local')->get($invoice->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
