<?php
namespace App\Http\Controllers\Partner;

use App\Models\Commission;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class CommissionController extends Controller
{
    public function index()
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $commissions = Commission::where('referral_partner_id', $partner->id)
            ->with('lead', 'invoice')
            ->latest()
            ->paginate(15);

        $allCommissions = Commission::where('referral_partner_id', $partner->id)->get();

        $totalEarned = $allCommissions->sum('commission_amount');
        $totalPaid = $allCommissions->where('status', 'paid')->sum('commission_amount');
        $totalEstimated = $allCommissions->where('status', 'estimated')->sum('commission_amount');
        $totalConfirmed = $allCommissions->where('status', 'confirmed')->sum('commission_amount');
        $totalScheduled = $allCommissions->where('status', 'scheduled')->sum('commission_amount');

        $upcomingPayouts = Commission::where('referral_partner_id', $partner->id)
            ->where('status', 'scheduled')
            ->whereNotNull('scheduled_payment_date')
            ->with('lead')
            ->orderBy('scheduled_payment_date')
            ->get();

        return Inertia::render('Partner/Commissions/Index', [
            'commissions' => $commissions,
            'totalEarned' => $totalEarned,
            'totalPaid' => $totalPaid,
            'totalEstimated' => $totalEstimated,
            'totalConfirmed' => $totalConfirmed,
            'totalScheduled' => $totalScheduled,
            'upcomingPayouts' => $upcomingPayouts,
        ]);
    }

    public function exportCsv()
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $commissions = Commission::where('referral_partner_id', $partner->id)
            ->with('invoice')
            ->orderBy('created_at', 'desc')
            ->get();

        $callback = function () use ($commissions) {
            $file = fopen('php://output', 'w');
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, ['Date', 'Facture', 'Base HT', 'Taux', 'Commission', 'Statut', 'Date paiement', 'Référence'], ';');
            foreach ($commissions as $c) {
                fputcsv($file, [
                    $c->created_at->format('d/m/Y'),
                    $c->invoice?->invoice_number ?? '',
                    number_format($c->base_amount, 2, ',', '.'),
                    $c->commission_rate . '%',
                    number_format($c->commission_amount, 2, ',', '.'),
                    $c->status,
                    $c->paid_date ? date('d/m/Y', strtotime($c->paid_date)) : '',
                    $c->payment_reference ?? '',
                ], ';');
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="commissions-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Exporter un relevé de commissions en PDF.
     */
    public function exportPdf(Request $request)
    {
        $partner = auth()->user()->referralPartner;
        if (!$partner) abort(403);

        $commissions = Commission::where('referral_partner_id', $partner->id)
            ->with('invoice')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalEstimated = $commissions->where('status', 'estimated')->sum('commission_amount');
        $totalConfirmed = $commissions->where('status', 'confirmed')->sum('commission_amount');
        $totalScheduled = $commissions->where('status', 'scheduled')->sum('commission_amount');
        $totalPaidCommissions = $commissions->where('status', 'paid')->sum('commission_amount');

        $partner->load('user');

        $pdf = Pdf::loadView('pdf.partner-commissions', [
            'partner' => $partner,
            'commissions' => $commissions,
            'totalEstimated' => $totalEstimated,
            'totalConfirmed' => $totalConfirmed,
            'totalScheduled' => $totalScheduled,
            'totalPaidCommissions' => $totalPaidCommissions,
        ])->setPaper('a4');

        return $pdf->download('commissions-' . now()->format('Y-m-d') . '.pdf');
    }
}
