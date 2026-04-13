<?php

namespace App\Http\Controllers\Client;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ExportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Générer un récapitulatif annuel de facturation pour le client connecté.
     */
    public function annualSummary(Request $request)
    {
        $user = auth()->user();
        $year = $request->input('year', now()->year);

        $invoices = Invoice::where('client_id', $user->id)
            ->whereYear('issue_date', $year)
            ->orderBy('issue_date')
            ->get();

        $totalInvoiced = $invoices->sum('total');
        $totalPaid = $invoices->sum('amount_paid');
        $totalOutstanding = $invoices->sum('amount_due');

        // Group by quarter
        $quarters = collect();
        for ($q = 1; $q <= 4; $q++) {
            $label = "Q{$q} {$year}";
            $qInvoices = $invoices->filter(function ($inv) use ($q) {
                if (!$inv->issue_date) return false;
                return ceil($inv->issue_date->month / 3) === $q;
            });
            $quarters[$label] = $qInvoices;
        }

        $pdf = Pdf::loadView('pdf.client-annual-summary', [
            'client' => $user,
            'year' => $year,
            'invoices' => $invoices,
            'quarters' => $quarters,
            'totalInvoiced' => $totalInvoiced,
            'totalPaid' => $totalPaid,
            'totalOutstanding' => $totalOutstanding,
        ])->setPaper('a4');

        return $pdf->download("facturation-{$year}.pdf");
    }
}
