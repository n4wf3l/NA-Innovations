<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ExportController extends BaseAdminController
{
    // ─── INVOICES ───

    public function invoicesPdf(Request $request)
    {
        $query = Invoice::with('client')->orderBy('issue_date', 'desc');
        $this->applyInvoiceFilters($query, $request);
        $invoices = $query->get();

        $totals = [
            'subtotal' => $invoices->sum('subtotal'),
            'tax' => $invoices->sum('tax_amount'),
            'total' => $invoices->sum('total'),
            'paid' => $invoices->sum('amount_paid'),
            'due' => $invoices->sum('amount_due'),
        ];

        $pdf = Pdf::loadView('pdf.export-invoices', [
            'invoices' => $invoices,
            'totals' => $totals,
            'filters' => ['status' => $request->status, 'from' => $request->from, 'to' => $request->to],
            'generated_at' => now(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('factures-' . now()->format('Y-m-d') . '.pdf');
    }

    public function invoicesCsv(Request $request)
    {
        $query = Invoice::with('client')->orderBy('issue_date', 'desc');
        $this->applyInvoiceFilters($query, $request);
        $invoices = $query->get();

        $headers = ['Numéro', 'Client', 'Entreprise', 'Type', 'Statut', 'Date émission', 'Date échéance', 'Sous-total', 'TVA', 'Total', 'Payé', 'Dû'];

        $rows = $invoices->map(fn($inv) => [
            $inv->invoice_number,
            $inv->client_name,
            $inv->client_company,
            $inv->type,
            $inv->status,
            $inv->issue_date?->format('d/m/Y'),
            $inv->due_date?->format('d/m/Y'),
            number_format($inv->subtotal, 2, ',', '.'),
            number_format($inv->tax_amount, 2, ',', '.'),
            number_format($inv->total, 2, ',', '.'),
            number_format($inv->amount_paid, 2, ',', '.'),
            number_format($inv->amount_due, 2, ',', '.'),
        ]);

        return $this->downloadCsv('factures-' . now()->format('Y-m-d') . '.csv', $headers, $rows);
    }

    // ─── LEADS ───

    public function leadsPdf(Request $request)
    {
        $query = Lead::with('referralPartner.user')->orderBy('created_at', 'desc');
        $this->applyLeadFilters($query, $request);
        $leads = $query->get();

        $stats = [
            'total' => $leads->count(),
            'won' => $leads->where('status', 'won')->count(),
            'lost' => $leads->where('status', 'lost')->count(),
            'conversion_rate' => $leads->count() > 0 ? round($leads->where('status', 'won')->count() / $leads->count() * 100, 1) : 0,
        ];

        $pdf = Pdf::loadView('pdf.export-leads', [
            'leads' => $leads,
            'stats' => $stats,
            'filters' => ['status' => $request->status, 'source' => $request->source, 'from' => $request->from, 'to' => $request->to],
            'generated_at' => now(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('leads-' . now()->format('Y-m-d') . '.pdf');
    }

    public function leadsCsv(Request $request)
    {
        $query = Lead::with('referralPartner.user')->orderBy('created_at', 'desc');
        $this->applyLeadFilters($query, $request);
        $leads = $query->get();

        $headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Source', 'Statut', 'Budget estimé', 'Partenaire', 'Date création'];

        $rows = $leads->map(fn($l) => [
            $l->first_name,
            $l->last_name,
            $l->email,
            $l->phone,
            $l->company_name,
            $l->source,
            $l->status,
            $l->estimated_budget ? number_format($l->estimated_budget, 2, ',', '.') : '',
            $l->referralPartner?->user?->name ?? '',
            $l->created_at?->format('d/m/Y'),
        ]);

        return $this->downloadCsv('leads-' . now()->format('Y-m-d') . '.csv', $headers, $rows);
    }

    // ─── COMMISSIONS ───

    public function commissionsPdf(Request $request)
    {
        $query = Commission::with(['referralPartner.user', 'lead', 'invoice'])->orderBy('created_at', 'desc');
        $this->applyCommissionFilters($query, $request);
        $commissions = $query->get();

        $totals = [
            'base' => $commissions->sum('base_amount'),
            'commission' => $commissions->sum('commission_amount'),
            'tax' => $commissions->sum('tax_amount'),
        ];

        $pdf = Pdf::loadView('pdf.export-commissions', [
            'commissions' => $commissions,
            'totals' => $totals,
            'filters' => ['status' => $request->status, 'from' => $request->from, 'to' => $request->to],
            'generated_at' => now(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('commissions-' . now()->format('Y-m-d') . '.pdf');
    }

    public function commissionsCsv(Request $request)
    {
        $query = Commission::with(['referralPartner.user', 'lead', 'invoice'])->orderBy('created_at', 'desc');
        $this->applyCommissionFilters($query, $request);
        $commissions = $query->get();

        $headers = ['Partenaire', 'Lead', 'Facture', 'Base HT', 'Taux', 'Commission', 'Statut', 'Date paiement', 'Référence', 'Date création'];

        $rows = $commissions->map(fn($c) => [
            $c->referralPartner?->user?->name ?? '',
            $c->lead ? "{$c->lead->first_name} {$c->lead->last_name}" : '',
            $c->invoice?->invoice_number ?? '',
            number_format($c->base_amount, 2, ',', '.'),
            $c->commission_rate . '%',
            number_format($c->commission_amount, 2, ',', '.'),
            $c->status,
            $c->paid_date?->format('d/m/Y') ?? '',
            $c->payment_reference ?? '',
            $c->created_at?->format('d/m/Y'),
        ]);

        return $this->downloadCsv('commissions-' . now()->format('Y-m-d') . '.csv', $headers, $rows);
    }

    // ─── QUOTES ───

    public function quotesCsv(Request $request)
    {
        $query = Quote::latest();
        if ($request->status) $query->where('status', $request->status);
        if ($request->from) $query->where('issue_date', '>=', $request->from);
        if ($request->to) $query->where('issue_date', '<=', $request->to);
        $quotes = $query->get();

        $headers = ['Numéro', 'Client', 'Titre', 'Statut', 'Total', 'Date émission', 'Valide jusqu\'au'];

        $rows = $quotes->map(fn($q) => [
            $q->quote_number,
            $q->client_name,
            $q->title,
            $q->status,
            number_format($q->total, 2, ',', '.'),
            $q->issue_date?->format('d/m/Y'),
            $q->valid_until?->format('d/m/Y'),
        ]);

        return $this->downloadCsv('devis-' . now()->format('Y-m-d') . '.csv', $headers, $rows);
    }

    // ─── PAYMENTS ───

    public function paymentsCsv(Request $request)
    {
        $query = Payment::with('invoice')->latest('payment_date');
        if ($request->from) $query->where('payment_date', '>=', $request->from);
        if ($request->to) $query->where('payment_date', '<=', $request->to);
        $payments = $query->get();

        $headers = ['Date paiement', 'Facture', 'Client', 'Montant', 'Méthode', 'Référence', 'Statut'];

        $rows = $payments->map(fn($p) => [
            $p->payment_date?->format('d/m/Y'),
            $p->invoice?->invoice_number,
            $p->invoice?->client_name,
            number_format($p->amount, 2, ',', '.'),
            $p->method,
            $p->reference,
            $p->status,
        ]);

        return $this->downloadCsv('paiements-' . now()->format('Y-m-d') . '.csv', $headers, $rows);
    }

    public function paymentsPdf(Request $request)
    {
        $query = Payment::with('invoice')->latest('payment_date');
        if ($request->from) $query->where('payment_date', '>=', $request->from);
        if ($request->to) $query->where('payment_date', '<=', $request->to);
        $payments = $query->get();

        $totals = ['total' => $payments->sum('amount')];

        $pdf = Pdf::loadView('pdf.export-payments', [
            'payments' => $payments,
            'totals' => $totals,
            'filters' => ['from' => $request->from, 'to' => $request->to],
            'generated_at' => now(),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('paiements-' . now()->format('Y-m-d') . '.pdf');
    }

    // ─── HELPERS ───

    private function applyInvoiceFilters($query, Request $request)
    {
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('type')) $query->where('type', $request->type);
        if ($request->filled('from')) $query->where('issue_date', '>=', $request->from);
        if ($request->filled('to')) $query->where('issue_date', '<=', $request->to);
    }

    private function applyLeadFilters($query, Request $request)
    {
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('source')) $query->where('source', $request->source);
        if ($request->filled('from')) $query->where('created_at', '>=', $request->from);
        if ($request->filled('to')) $query->where('created_at', '<=', $request->to);
    }

    private function applyCommissionFilters($query, Request $request)
    {
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('partner_id')) $query->where('referral_partner_id', $request->partner_id);
        if ($request->filled('from')) $query->where('created_at', '>=', $request->from);
        if ($request->filled('to')) $query->where('created_at', '<=', $request->to);
    }

    private function downloadCsv(string $filename, array $headers, $rows)
    {
        $callback = function () use ($headers, $rows) {
            $file = fopen('php://output', 'w');
            // BOM for Excel UTF-8
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, $headers, ';');
            foreach ($rows as $row) {
                fputcsv($file, $row instanceof \Illuminate\Support\Collection ? $row->toArray() : (array) $row, ';');
            }
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
