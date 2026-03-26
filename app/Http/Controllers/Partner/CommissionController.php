<?php
namespace App\Http\Controllers\Partner;

use App\Models\Commission;
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
}
