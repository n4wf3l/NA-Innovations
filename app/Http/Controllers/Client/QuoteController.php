<?php

namespace App\Http\Controllers\Client;

use App\Models\Quote;
use App\Services\NotificationService;
use App\Services\WorkflowService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuoteController extends Controller
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

    private function canAccess(Quote $quote): bool
    {
        $user = Auth::user();
        return $quote->client_id == $user->id || $quote->client_email === $user->email;
    }

    public function index()
    {
        $quotes = Quote::where($this->clientScope())
            ->whereNotIn('status', ['draft'])
            ->latest()
            ->get();

        return Inertia::render('Client/Quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function show(Quote $quote)
    {
        if (!$this->canAccess($quote)) {
            abort(403);
        }

        $quote->load('items');

        // Mark as viewed + notify admin
        if (!$quote->viewed_at && in_array($quote->status, ['sent'])) {
            $quote->update(['status' => 'viewed', 'viewed_at' => now()]);
            NotificationService::sendToAdmins('quote-viewed-admin', [
                'client_name' => $quote->client_name,
                'quote_number' => $quote->quote_number,
            ], actionUrl: "/admin/quotes/{$quote->id}");
        }

        return Inertia::render('Client/Quotes/Show', [
            'quote' => $quote,
        ]);
    }

    public function downloadPdf(Quote $quote)
    {
        if (!$this->canAccess($quote)) {
            abort(403);
        }

        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            \App\Services\PdfService::generateQuotePdf($quote);
            $quote->refresh();
        }

        return Storage::disk('local')->download($quote->pdf_path, "{$quote->quote_number}.pdf");
    }

    public function previewPdf(Quote $quote)
    {
        if (!$this->canAccess($quote)) {
            abort(403);
        }

        if (!$quote->pdf_path || !Storage::disk('local')->exists($quote->pdf_path)) {
            \App\Services\PdfService::generateQuotePdf($quote);
            $quote->refresh();
        }

        return response(Storage::disk('local')->get($quote->pdf_path), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }

    /**
     * Client accepts a quote - triggers full workflow.
     */
    public function accept(Quote $quote)
    {
        if (!$this->canAccess($quote)) {
            abort(403);
        }

        if (!in_array($quote->status, ['sent', 'viewed'])) {
            return redirect()->back()->with('error', 'This quote cannot be accepted.');
        }

        WorkflowService::onQuoteAccepted($quote);

        return redirect()->back()->with('success', 'Quote accepted! Your project has been initiated.');
    }

    /**
     * Client rejects a quote.
     */
    public function reject(Request $request, Quote $quote)
    {
        if (!$this->canAccess($quote)) {
            abort(403);
        }

        if (!in_array($quote->status, ['sent', 'viewed'])) {
            return redirect()->back()->with('error', 'This quote cannot be rejected.');
        }

        $request->validate(['reason' => 'nullable|string|max:1000']);

        WorkflowService::onQuoteRejected($quote, $request->input('reason'));

        return redirect()->back()->with('success', 'Quote rejected.');
    }
}
