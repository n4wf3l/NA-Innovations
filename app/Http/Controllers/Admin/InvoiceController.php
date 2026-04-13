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
        $totalOverdue = Invoice::whereIn('status', ['sent', 'viewed', 'partially_paid', 'overdue'])
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
     * Bulk update status for multiple invoices.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:invoices,id',
            'status' => 'required|in:draft,sent,paid,cancelled',
        ]);

        Invoice::whereIn('id', $request->ids)->update(['status' => $request->status]);

        return redirect()->back()->with('success', count($request->ids) . ' facture(s) mise(s) à jour.');
    }

    /**
     * Bulk delete multiple invoices (only drafts).
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:invoices,id',
        ]);

        // Only delete drafts
        Invoice::whereIn('id', $request->ids)->where('status', 'draft')->delete();

        return redirect()->back()->with('success', 'Factures brouillon supprimées.');
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
     * Store an externally uploaded invoice document.
     */
    public function storeExternal(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480',
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_id' => 'nullable|exists:users,id',
            'total' => 'required|numeric|min:0',
            'issue_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'is_signed' => 'nullable|boolean',
        ]);

        $invoiceNumber = NumberGenerator::generateInvoiceNumber();
        $file = $request->file('file');
        $pdfPath = $file->store('invoices', 'local');

        $total = (float) $validated['total'];

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'title' => $validated['title'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_company' => $validated['client_company'] ?? null,
            'client_id' => $validated['client_id'] ?? null,
            'total' => $total,
            'subtotal' => round($total / 1.21, 2),
            'tax_rate' => 21,
            'tax_amount' => round($total - ($total / 1.21), 2),
            'amount_due' => $total,
            'amount_paid' => 0,
            'issue_date' => $validated['issue_date'] ?? now()->toDateString(),
            'due_date' => $validated['due_date'] ?? now()->addDays(30)->toDateString(),
            'notes' => $validated['notes'] ?? null,
            'status' => $request->boolean('is_signed') ? 'sent' : 'draft',
            'pdf_path' => $pdfPath,
            'view_token' => Str::random(64),
            'is_external' => true,
        ]);

        return redirect()->route('admin.invoices.show', $invoice)->with('success', 'Document externe téléversé avec succès.');
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
        if ($invoice->status !== 'draft') {
            return redirect()->back()->with('error', 'Cannot edit an invoice that has already been sent or paid.');
        }

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
     * Duplicate an existing invoice.
     */
    public function duplicate(Invoice $invoice)
    {
        $invoice->load('items');

        $newInvoice = $invoice->replicate([
            'invoice_number', 'status', 'view_token', 'sent_at', 'viewed_at',
            'paid_at', 'pdf_path', 'amount_paid',
        ]);
        $newInvoice->invoice_number = NumberGenerator::generateInvoiceNumber();
        $newInvoice->view_token = Str::random(64);
        $newInvoice->status = 'draft';
        $newInvoice->issue_date = now()->toDateString();
        $newInvoice->due_date = now()->addDays(30)->toDateString();
        $newInvoice->amount_paid = 0;
        $newInvoice->amount_due = $invoice->total;
        $newInvoice->save();

        foreach ($invoice->items as $item) {
            $newItem = $item->replicate();
            $newItem->invoice_id = $newInvoice->id;
            $newItem->save();
        }

        return redirect()->route('admin.invoices.edit', $newInvoice)->with('success', 'Facture dupliquée avec succès.');
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

        // Check that the client user exists (not soft-deleted)
        if ($invoice->client_id && !User::find($invoice->client_id)) {
            return redirect()->back()->with('error', 'The client associated with this invoice no longer exists.');
        }

        $oldStatus = $invoice->status;

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
            'old_value' => $oldStatus,
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

        // Send actual email with PDF attachment
        try {
            $emailSubject = $request->input('email_subject', "Facture {$invoice->invoice_number}");
            $emailBody = $request->input('email_body', "Veuillez trouver ci-joint votre facture.");

            \Illuminate\Support\Facades\Mail::to($invoice->client_email)
                ->send(new \App\Mail\TemplateMail($emailSubject, $emailBody, $invoice->pdf_path));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send invoice email: {$e->getMessage()}");
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

        if ($validated['amount'] > $invoice->amount_due) {
            return redirect()->back()->with('error', 'Payment amount cannot exceed the amount due.');
        }

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

    /**
     * Créer un avoir (credit note) à partir d'une facture existante.
     */
    public function createCreditNote(Invoice $invoice)
    {
        if (!in_array($invoice->status, ['paid', 'sent', 'overdue', 'partially_paid'])) {
            return redirect()->back()->with('error', __('Un avoir ne peut être créé que pour une facture envoyée ou payée.'));
        }

        // Generate CN number
        $year = now()->format('Y');
        $count = Invoice::where('type', 'credit_note')
            ->whereYear('created_at', $year)
            ->count() + 1;
        $cnNumber = sprintf('CN-%s-%03d', $year, $count);

        $creditNote = Invoice::create([
            'invoice_number' => $cnNumber,
            'quote_id' => $invoice->quote_id,
            'client_id' => $invoice->client_id,
            'projet_id' => $invoice->projet_id,
            'client_name' => $invoice->client_name,
            'client_email' => $invoice->client_email,
            'client_company' => $invoice->client_company,
            'client_address' => $invoice->client_address,
            'client_vat' => $invoice->client_vat,
            'title' => __('Avoir') . ' — ' . $invoice->invoice_number,
            'type' => 'credit_note',
            'credit_note_for' => $invoice->id,
            'subtotal' => -abs($invoice->subtotal),
            'discount_amount' => 0,
            'tax_rate' => $invoice->tax_rate,
            'tax_amount' => -abs($invoice->tax_amount),
            'total' => -abs($invoice->total),
            'amount_paid' => 0,
            'amount_due' => -abs($invoice->total),
            'currency' => $invoice->currency ?? 'EUR',
            'locale' => $invoice->locale ?? 'fr',
            'issue_date' => now()->toDateString(),
            'due_date' => now()->toDateString(),
            'view_token' => Str::random(64),
            'status' => 'draft',
            'notes' => __('Avoir pour la facture :number', ['number' => $invoice->invoice_number]),
        ]);

        // Copy items with negative amounts
        foreach ($invoice->items as $item) {
            $creditNote->items()->create([
                'description' => $item->description,
                'details' => $item->details,
                'quantity' => $item->quantity,
                'unit' => $item->unit,
                'unit_price' => -abs($item->unit_price),
                'total' => -abs($item->total),
                'sort_order' => $item->sort_order,
            ]);
        }

        // Generate PDF
        PdfService::generateInvoicePdf($creditNote);

        return redirect()->route('admin.invoices.show', $creditNote)
            ->with('success', __('Avoir :number créé avec succès.', ['number' => $cnNumber]));
    }
}
