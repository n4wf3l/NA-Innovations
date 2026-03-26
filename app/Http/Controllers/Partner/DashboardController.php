<?php
namespace App\Http\Controllers\Partner;

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

        return Inertia::render('Partner/Dashboard', [
            'partner' => $partner,
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
        ]);
    }
}
