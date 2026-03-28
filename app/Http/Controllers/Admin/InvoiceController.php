<?php

namespace App\Http\Controllers\Admin;

use App\Models\Invoice;
use App\Models\User;
use App\Models\EmailTemplate;
use App\Services\InvoiceService;
use App\Services\NotificationService;
use App\Services\NumberGenerator;
use App\Services\PdfService;
use App\Services\CommissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvoiceController extends BaseAdminController
{
    /**
     * Display a listing of invoices with filters.
     */
    public function index(Request $request)
    {
        $query = Invoice::with('client', 'quote');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by client
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Search by title or invoice number
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('invoice_number', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        $invoices = $query->latest()->paginate(15)->withQueryString();

        $totalInvoices = Invoice::count();
        $totalBilled = Invoice::sum('total');
        $totalPaid = Invoice::where('status', 'paid')->sum('total');
        $totalOverdue = Invoice::where('status', 'sent')
            ->where('due_date', '<', now())
            ->sum('amount_due');

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
            'totalInvoices' => $totalInvoices,
            'totalBilled' => $totalBilled,
            'totalPaid' => $totalPaid,
            'totalOverdue' => $totalOverdue,
        ]);
    }

    /**
     * Show the form for creating a new invoice.
     */
    public function create(Request $request)
    {
        $clients = User::where('role', 'client')->orderBy('name')->get();

        return Inertia::render('Admin/Invoices/Create', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created invoice (standalone).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_address' => 'nullable|string|max:500',
            'client_vat' => 'nullable|string|max:50',
            'client_id' => 'nullable|exists:users,id',
            'type' => 'nullable|string|in:standard,deposit,final,credit_note',
            'tax_rate' => 'numeric|min:0|max:100',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'payment_instructions' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string|max:50',
            'locale' => 'nullable|string|in:fr,en,nl',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        if (empty($validated['locale'])) {
            $validated['locale'] = 'fr';
        }

        // Calculate totals
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
        }

        $taxRate = $validated['tax_rate'] ?? 21;
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        $validated['invoice_number'] = NumberGenerator::generateInvoiceNumber();
        $validated['view_token'] = Str::random(64);
        $validated['status'] = 'draft';
        $validated['subtotal'] = round($subtotal, 2);
        $validated['tax_amount'] = round($taxAmount, 2);
        $validated['total'] = round($total, 2);
        $validated['amount_due'] = round($total, 2);
        $validated['amount_paid'] = 0;

        $invoice = Invoice::create($validated);

        // Create invoice items
        foreach ($items as $index => $item) {
            $itemTotal = ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'] ?? 1,
                'unit' => $item['unit'] ?? 'unit',
                'unit_price' => $item['unit_price'] ?? 0,
                'total' => $itemTotal,
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('admin.invoices.show', $invoice)->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load([
            'items',
            'payments',
            'quote',
            'client',
            'timelineEvents' => function ($query) {
                $query->latest();
            },
        ]);

        $emailTemplates = [];
        foreach (['fr', 'en', 'nl'] as $loc) {
            $tpl = EmailTemplate::where('slug', 'invoice-sent')->where('locale', $loc)->first();
            $emailTemplates[$loc] = $tpl
                ? ['subject' => $tpl->subject, 'body' => strip_tags($tpl->body)]
                : ['subject' => __('pdf.invoice_email_subject', ['number' => $invoice->invoice_number], $loc),
                   'body' => __('pdf.invoice_email_body', ['name' => '{{ client_name }}', 'number' => $invoice->invoice_number, 'total' => '{{ total }}', 'due_date' => '{{ due_date }}'], $loc)];
        }

        return Inertia::render('Admin/Invoices/Show', [
            'invoice' => $invoice,
            'emailTemplates' => $emailTemplates,
        ]);
    }

    /**
     * Show the form for editing the specified invoice.
     */
    public function edit(Invoice $invoice)
    {
        $invoice->load('items');
        $clients = User::where('role', 'client')->orderBy('name')->get();

        return Inertia::render('Admin/Invoices/Edit', [
            'invoice' => $invoice,
            'clients' => $clients,
        ]);
    }

    /**
     * Update the specified invoice.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_address' => 'nullable|string|max:500',
            'client_vat' => 'nullable|string|max:50',
            'client_id' => 'nullable|exists:users,id',
            'type' => 'nullable|string|in:standard,deposit,final,credit_note',
            'tax_rate' => 'numeric|min:0|max:100',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'payment_instructions' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string|max:50',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        // Recalculate totals
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
        }

        $taxRate = $validated['tax_rate'] ?? 21;
        $taxAmount = $subtotal * ($taxRate / 100);
        $total = $subtotal + $taxAmount;

        $validated['subtotal'] = round($subtotal, 2);
        $validated['tax_amount'] = round($taxAmount, 2);
        $validated['total'] = round($total, 2);

        // Recalculate amount_due considering payments
        $totalPaid = $invoice->payments()->where('status', 'confirmed')->sum('amount');
        $validated['amount_due'] = round(max(0, $total - $totalPaid), 2);

        $invoice->update($validated);

        // Sync invoice items
        $invoice->items()->delete();
        foreach ($items as $index => $item) {
            $itemTotal = ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'] ?? 1,
                'unit' => $item['unit'] ?? 'unit',
                'unit_price' => $item['unit_price'] ?? 0,
                'total' => $itemTotal,
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('admin.invoices.show', $invoice)->with('success', 'Invoice updated successfully.');
    }

    /**
     * Soft delete the specified invoice (only if draft).
     */
    public function destroy(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return redirect()->back()->with('error', 'Only draft invoices can be deleted.');
        }

        $invoice->delete();

        return redirect()->route('admin.invoices.index')->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Mark invoice as sent.
     */
    public function send(Request $request, Invoice $invoice)
    {
        $request->validate([
            'email_subject' => 'nullable|string|max:500',
            'email_body' => 'nullable|string',
        ]);

        $invoice->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        // Generate PDF
        PdfService::generateInvoicePdf($invoice);

        // Create timeline event
        $invoice->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'status_change',
            'title' => 'Invoice sent',
            'description' => "Invoice {$invoice->invoice_number} was sent to {$invoice->client_email}",
            'old_value' => 'draft',
            'new_value' => 'sent',
        ]);

        // Send email to client with PDF
        if ($invoice->client_id) {
            $client = User::find($invoice->client_id);
            if ($client) {
                NotificationService::send(
                    $client,
                    'invoice-sent',
                    [
                        'client_name' => $invoice->client_name,
                        'invoice_number' => $invoice->invoice_number,
                        'total' => number_format($invoice->total, 2, ',', '.') . ' EUR',
                        'due_date' => $invoice->due_date ? $invoice->due_date->format('d/m/Y') : '--',
                    ],
                    $invoice->pdf_path,
                    transactional: true,
                );
            }
        }

        return redirect()->back()->with('success', 'Invoice marked as sent.');
    }

    /**
     * Record a payment for the invoice.
     */
    public function recordPayment(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'method' => 'nullable|string|in:bank_transfer,cash,card,paypal,other',
            'reference' => 'nullable|string|max:255',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $payment = InvoiceService::recordPayment($invoice, $validated);

        // Calculate commission if applicable
        CommissionService::calculateForPayment($payment);

        return redirect()->back()->with('success', 'Payment recorded successfully.');
    }

    /**
     * Download the invoice PDF.
     */
    public function downloadPdf(Invoice $invoice)
    {
        if (!$invoice->pdf_path || !Storage::disk('local')->exists($invoice->pdf_path)) {
            PdfService::generateInvoicePdf($invoice);
            $invoice->refresh();
        }

        return Storage::disk('local')->download($invoice->pdf_path, "{$invoice->invoice_number}.pdf");
    }

    /**
     * Stream the invoice PDF inline for preview.
     */
    public function previewPdf(Invoice $invoice)
    {
        if (!$invoice->pdf_path || !Storage::disk('local')->exists($invoice->pdf_path)) {
            PdfService::generateInvoicePdf($invoice);
            $invoice->refresh();
        }

        return response(Storage::disk('local')->get($invoice->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
