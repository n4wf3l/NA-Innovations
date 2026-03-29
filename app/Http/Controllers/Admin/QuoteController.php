<?php

namespace App\Http\Controllers\Admin;

use App\Models\Quote;
use App\Models\Lead;
use App\Models\User;
use App\Models\EmailTemplate;
use App\Services\NotificationService;
use App\Services\QuoteService;
use App\Services\WorkflowService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class QuoteController extends BaseAdminController
{
    /**
     * Display a listing of quotes with filters.
     */
    public function index(Request $request)
    {
        $query = Quote::with('client', 'lead');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by client
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Search by title or quote number
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('quote_number', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%");
            });
        }

        $quotes = $query->latest()->paginate(15)->withQueryString();

        $totalQuotes = Quote::count();
        $acceptedQuotes = Quote::where('status', 'accepted')->count();
        $pendingValue = Quote::whereIn('status', ['sent', 'viewed'])->sum('total');
        $conversionRate = $totalQuotes > 0 ? round(($acceptedQuotes / $totalQuotes) * 100) : 0;

        return Inertia::render('Admin/Quotes/Index', [
            'quotes' => $quotes,
            'totalQuotes' => $totalQuotes,
            'acceptedQuotes' => $acceptedQuotes,
            'pendingValue' => $pendingValue,
            'conversionRate' => $conversionRate,
        ]);
    }

    /**
     * Show the form for creating a new quote.
     */
    public function create(Request $request)
    {
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $leads = Lead::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Quotes/Create', [
            'clients' => $clients,
            'leads' => $leads,
            'savedSignature' => auth()->user()->signature,
        ]);
    }

    /**
     * Store a newly created quote.
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
            'lead_id' => 'nullable|exists:leads,id',
            'introduction' => 'nullable|string',
            'scope_of_work' => 'nullable|string',
            'exclusions' => 'nullable|string',
            'tax_rate' => 'numeric|min:0|max:100',
            'deposit_percentage' => 'integer|min:0|max:100',
            'valid_until' => 'nullable|date',
            'terms_and_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.is_optional' => 'nullable',
            'include_signature' => 'nullable|boolean',
            'signature_data' => 'nullable|string',
            'locale' => 'nullable|string|in:fr,en,nl',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        if (empty($validated['locale'])) {
            $validated['locale'] = 'fr';
        }

        // Handle signature
        if (!empty($validated['include_signature']) && empty($validated['signature_data'])) {
            $validated['signature_data'] = auth()->user()->signature;
        }
        if (!empty($validated['signature_data']) && $validated['signature_data'] !== auth()->user()->signature) {
            $user = auth()->user();
            $user->signature = $validated['signature_data'];
            $user->save();
        }

        $quote = QuoteService::create($validated, $items);

        return redirect()->route('admin.quotes.show', $quote)->with('success', 'Quote created successfully.');
    }

    /**
     * Store an externally uploaded quote document.
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
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
            'is_signed' => 'nullable|boolean',
        ]);

        $quoteNumber = \App\Services\NumberGenerator::generateQuoteNumber();
        $file = $request->file('file');
        $pdfPath = $file->store('quotes', 'local');

        $total = (float) $validated['total'];

        $quote = Quote::create([
            'quote_number' => $quoteNumber,
            'title' => $validated['title'],
            'client_name' => $validated['client_name'],
            'client_email' => $validated['client_email'],
            'client_company' => $validated['client_company'] ?? null,
            'client_id' => $validated['client_id'] ?? null,
            'total' => $total,
            'subtotal' => round($total / 1.21, 2),
            'tax_rate' => 21,
            'tax_amount' => round($total - ($total / 1.21), 2),
            'deposit_percentage' => 0,
            'deposit_amount' => 0,
            'discount_amount' => 0,
            'issue_date' => $validated['issue_date'] ?? now()->toDateString(),
            'valid_until' => $validated['valid_until'] ?? now()->addDays(30)->toDateString(),
            'notes' => $validated['notes'] ?? null,
            'status' => $request->boolean('is_signed') ? 'accepted' : 'draft',
            'pdf_path' => $pdfPath,
            'view_token' => \Illuminate\Support\Str::random(64),
            'is_external' => true,
        ]);

        return redirect()->route('admin.quotes.show', $quote)->with('success', 'Document externe téléversé avec succès.');
    }

    /**
     * Display the specified quote.
     */
    public function show(Quote $quote)
    {
        $quote->load([
            'items',
            'invoices',
            'lead',
            'client',
            'timelineEvents' => function ($query) {
                $query->latest();
            },
        ]);

        $emailTemplates = [];
        foreach (['fr', 'en', 'nl'] as $loc) {
            $tpl = EmailTemplate::where('slug', 'quote-sent')->where('locale', $loc)->first();
            $emailTemplates[$loc] = $tpl
                ? ['subject' => $tpl->subject, 'body' => strip_tags($tpl->body)]
                : ['subject' => __('pdf.quote_email_subject', ['number' => $quote->quote_number], $loc),
                   'body' => __('pdf.quote_email_body', ['name' => '{{ client_name }}', 'number' => $quote->quote_number, 'total' => '{{ total }}', 'valid_until' => '{{ valid_until }}'], $loc)];
        }

        return Inertia::render('Admin/Quotes/Show', [
            'quote' => $quote,
            'emailTemplates' => $emailTemplates,
        ]);
    }

    /**
     * Show the form for editing the specified quote.
     */
    public function edit(Quote $quote)
    {
        $quote->load('items');
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $leads = Lead::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Quotes/Edit', [
            'quote' => $quote,
            'clients' => $clients,
            'leads' => $leads,
            'savedSignature' => auth()->user()->signature,
        ]);
    }

    /**
     * Update the specified quote.
     */
    public function update(Request $request, Quote $quote)
    {
        if ($quote->status !== 'draft') {
            return redirect()->back()->with('error', 'Cannot edit a quote that has already been sent.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'client_company' => 'nullable|string|max:255',
            'client_address' => 'nullable|string|max:500',
            'client_vat' => 'nullable|string|max:50',
            'client_id' => 'nullable|exists:users,id',
            'lead_id' => 'nullable|exists:leads,id',
            'introduction' => 'nullable|string',
            'scope_of_work' => 'nullable|string',
            'exclusions' => 'nullable|string',
            'tax_rate' => 'numeric|min:0|max:100',
            'deposit_percentage' => 'integer|min:0|max:100',
            'valid_until' => 'nullable|date',
            'terms_and_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.is_optional' => 'nullable',
            'include_signature' => 'nullable|boolean',
            'signature_data' => 'nullable|string',
            'locale' => 'nullable|string|in:fr,en,nl',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        if (!empty($validated['include_signature']) && empty($validated['signature_data'])) {
            $validated['signature_data'] = auth()->user()->signature;
        }

        if (!empty($validated['signature_data']) && $validated['signature_data'] !== auth()->user()->signature) {
            $user = auth()->user();
            $user->signature = $validated['signature_data'];
            $user->save();
        }

        $quote->update($validated);
        QuoteService::syncItems($quote, $items);
        QuoteService::recalculate($quote);

        return redirect()->route('admin.quotes.show', $quote)->with('success', 'Quote updated successfully.');
    }

    /**
     * Soft delete the specified quote.
     */
    public function destroy(Quote $quote)
    {
        $quote->delete();

        return redirect()->route('admin.quotes.index')->with('success', 'Quote deleted successfully.');
    }

    /**
     * Mark quote as sent.
     */
    public function send(Request $request, Quote $quote)
    {
        if ($quote->client_id && !$quote->client) {
            return redirect()->back()->with('error', 'Cannot send quote: the associated client no longer exists.');
        }

        $request->validate([
            'email_subject' => 'nullable|string|max:500',
            'email_body' => 'nullable|string',
        ]);

        $quote->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        // Generate PDF
        PdfService::generateQuotePdf($quote);

        // Create timeline event
        $quote->timelineEvents()->create([
            'user_id' => auth()->id(),
            'event_type' => 'status_change',
            'title' => 'Quote sent',
            'description' => "Quote {$quote->quote_number} was sent to {$quote->client_email}",
            'old_value' => 'draft',
            'new_value' => 'sent',
        ]);

        // Send email to client with PDF attachment
        if ($quote->client_id) {
            $client = User::find($quote->client_id);
            if ($client) {
                NotificationService::send(
                    $client,
                    'quote-sent',
                    [
                        'client_name' => $quote->client_name,
                        'quote_number' => $quote->quote_number,
                        'total' => number_format($quote->total, 2, ',', '.') . ' EUR',
                        'valid_until' => $quote->valid_until ? $quote->valid_until->format('d/m/Y') : '--',
                    ],
                    $quote->pdf_path,
                    transactional: true,
                    actionUrl: url("/quotes/{$quote->id}/view/{$quote->view_token}"),
                );
            }
        }

        // Send actual email with PDF attachment
        try {
            $emailSubject = $request->input('email_subject', "Devis {$quote->quote_number}");
            $emailBody = $request->input('email_body', "Veuillez trouver ci-joint votre devis.");

            \Illuminate\Support\Facades\Mail::to($quote->client_email)
                ->send(new \App\Mail\TemplateMail($emailSubject, $emailBody, $quote->pdf_path));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send quote email: {$e->getMessage()}");
        }

        return redirect()->back()->with('success', 'Quote marked as sent.');
    }

    /**
     * Mark quote as accepted — triggers full workflow.
     */
    public function accept(Quote $quote)
    {
        if ($quote->status === 'accepted') {
            return redirect()->back()->with('error', 'This quote has already been accepted.');
        }

        $actions = WorkflowService::onQuoteAccepted($quote);

        $message = 'Quote accepted.';
        if (in_array('deposit_invoice_created', $actions)) {
            $message .= ' Deposit invoice created.';
        }
        if (in_array('project_created', $actions)) {
            $message .= ' Project initialized.';
        }
        if (in_array('client_linked', $actions)) {
            $message .= ' Client linked.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Mark quote as rejected.
     */
    public function reject(Request $request, Quote $quote)
    {
        $request->validate(['reason' => 'nullable|string|max:1000']);

        WorkflowService::onQuoteRejected($quote, $request->input('reason'));

        return redirect()->back()->with('success', 'Quote rejected.');
    }

    /**
     * Duplicate an existing quote.
     */
    public function duplicate(Quote $quote)
    {
        $newQuote = QuoteService::duplicate($quote);

        return redirect()->route('admin.quotes.edit', $newQuote)->with('success', 'Quote duplicated successfully.');
    }

    /**
     * Create an invoice from a quote.
     */
    public function createInvoice(Request $request, Quote $quote)
    {
        if (!in_array($quote->status, ['accepted', 'won'])) {
            return redirect()->back()->with('error', 'Cannot convert to invoice: quote status must be accepted or won.');
        }

        $type = $request->input('type', 'deposit');

        $invoice = QuoteService::convertToInvoice($quote, $type);

        return redirect()->route('admin.invoices.show', $invoice)->with('success', 'Invoice created from quote.');
    }

    /**
     * Download the quote PDF.
     */
    public function downloadPdf(Quote $quote)
    {
        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            PdfService::generateQuotePdf($quote);
            $quote->refresh();
        }

        return Storage::disk('local')->download($quote->pdf_path, "{$quote->quote_number}.pdf");
    }

    /**
     * Stream the quote PDF inline for preview.
     */
    public function previewPdf(Quote $quote)
    {
        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            PdfService::generateQuotePdf($quote);
            $quote->refresh();
        }

        return response(Storage::disk('local')->get($quote->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
