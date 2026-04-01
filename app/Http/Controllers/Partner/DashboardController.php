<?php
namespace App\Http\Controllers\Partner;

use App\Models\Lead;
use App\Models\Commission;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $partner = $user->referralPartner;

        if (!$partner) abort(403);

        $leads = $partner->leads()->with('convertedClient')->latest()->get();
        $commissions = $partner->commissions()->with('invoice')->latest()->get();

        $totalLeads = $leads->count();
        $wonLeads = $leads->where('status', 'won')->count();
        $conversionRate = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100) : 0;

        $totalEarned = $commissions->sum('commission_amount');
        $totalPaid = $commissions->where('status', 'paid')->sum('commission_amount');
        $pendingPayout = $commissions->whereIn('status', ['confirmed', 'scheduled'])->sum('commission_amount');
        $estimatedPending = $commissions->where('status', 'estimated')->sum('commission_amount');

        // Advanced stats
        $allLeads = $partner->leads()->get();
        $avgDealSize = $allLeads->where('status', 'won')->avg('estimated_budget') ?: 0;
        $topService = $allLeads->groupBy('service_interest')
            ->map->count()
            ->sortDesc()
            ->keys()
            ->first() ?: 'N/A';

        // Pipeline counts
        $pipelineCounts = [
            'new' => $allLeads->where('status', 'new')->count(),
            'contacted' => $allLeads->where('status', 'contacted')->count(),
            'brief' => $allLeads->whereIn('status', ['brief_pending', 'brief_completed'])->count(),
            'quote' => $allLeads->whereIn('status', ['quote_draft', 'quote_sent', 'qualified', 'call_scheduled'])->count(),
            'won' => $allLeads->where('status', 'won')->count(),
            'lost' => $allLeads->whereIn('status', ['lost', 'not_qualified'])->count(),
        ];

        $notifications = \App\Models\NotificationLog::where('user_id', auth()->id())
            ->where('is_read', false)
            ->latest()
            ->take(5)
            ->get();

        // Monthly leads for last 6 months
        $monthlyLeads = [];
        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();
            $monthlyLeads[] = [
                'month' => $start->format('M Y'),
                'total' => Lead::where('referral_partner_id', $partner->id)->whereBetween('created_at', [$start, $end])->count(),
                'won' => Lead::where('referral_partner_id', $partner->id)->where('status', 'won')->whereBetween('created_at', [$start, $end])->count(),
            ];
        }

        $cumulativeEarnings = Commission::where('referral_partner_id', $partner->id)->where('status', 'paid')->sum('commission_amount');

        return Inertia::render('Partner/Dashboard', [
            'partner' => $partner->load('user'),
            'stats' => [
                'totalLeads' => $totalLeads,
                'wonLeads' => $wonLeads,
                'conversionRate' => $conversionRate,
                'totalEarned' => $totalEarned,
                'totalPaid' => $totalPaid,
                'pendingPayout' => $pendingPayout,
                'estimatedPending' => $estimatedPending,
                'avgDealSize' => round($avgDealSize, 2),
                'topService' => $topService,
                'pipelineCounts' => $pipelineCounts,
            ],
            'recentLeads' => $leads->take(10)->values(),
            'recentCommissions' => $commissions->take(10)->values(),
            'notifications' => $notifications,
            'monthlyLeads' => $monthlyLeads,
            'cumulativeEarnings' => $cumulativeEarnings,
        ]);
    }
}
