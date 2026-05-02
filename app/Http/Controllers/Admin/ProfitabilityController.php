<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\Payment;
use App\Models\Projet;
use App\Models\TimeEntry;
use App\Models\User;
use Inertia\Inertia;

class ProfitabilityController extends BaseAdminController
{
    public function index()
    {
        // ─────────── Projects ───────────
        $projects = Projet::with(['client:id,name', 'developer:id,name', 'lead.referralPartner.user:id,name'])
            ->get();

        $projectIds = $projects->pluck('id');

        // Revenue per project (from confirmed payments via invoices)
        $revenueByProject = Payment::query()
            ->where('payments.status', 'confirmed')
            ->join('invoices', 'payments.invoice_id', '=', 'invoices.id')
            ->whereIn('invoices.projet_id', $projectIds)
            ->selectRaw('invoices.projet_id as projet_id, SUM(payments.amount) as revenue')
            ->groupBy('invoices.projet_id')
            ->pluck('revenue', 'projet_id');

        // Dev cost per project (from time_entries)
        $costByProject = TimeEntry::whereIn('project_id', $projectIds)
            ->where('approval_status', 'approved')
            ->whereNotNull('hourly_rate_snapshot')
            ->selectRaw('project_id, SUM(hours * hourly_rate_snapshot) as cost')
            ->groupBy('project_id')
            ->pluck('cost', 'project_id');

        // Commissions per project
        $commissionsByProject = Commission::whereIn('projet_id', $projectIds)
            ->whereIn('status', ['paid', 'scheduled', 'confirmed'])
            ->selectRaw('projet_id, SUM(commission_amount) as total')
            ->groupBy('projet_id')
            ->pluck('total', 'projet_id');

        $projectRows = $projects->map(function ($p) use ($revenueByProject, $costByProject, $commissionsByProject) {
            $revenue = (float) ($revenueByProject[$p->id] ?? 0);
            $devCost = (float) ($costByProject[$p->id] ?? 0);
            $commission = (float) ($commissionsByProject[$p->id] ?? 0);
            $margin = $revenue - $devCost - $commission;
            $marginPct = $revenue > 0 ? round(($margin / $revenue) * 100, 1) : null;

            return [
                'id' => $p->id,
                'name' => $p->nom_societe,
                'status' => $p->status,
                'client_name' => $p->client?->name,
                'client_id' => $p->client_id,
                'developer_name' => $p->developer?->name,
                'developer_id' => $p->developer_id,
                'partner_name' => $p->lead?->referralPartner?->user?->name,
                'partner_id' => $p->lead?->referralPartner?->id,
                'budget' => (float) ($p->budget ?? 0),
                'revenue' => round($revenue, 2),
                'dev_cost' => round($devCost, 2),
                'commission' => round($commission, 2),
                'margin' => round($margin, 2),
                'margin_pct' => $marginPct,
            ];
        })->values();

        // ─────────── Clients (aggregate over their projects) ───────────
        $clientRows = $projectRows->groupBy('client_id')->filter(fn ($g, $k) => $k !== null)->map(function ($rows, $clientId) {
            $first = $rows->first();
            $revenue = (float) $rows->sum('revenue');
            $devCost = (float) $rows->sum('dev_cost');
            $commission = (float) $rows->sum('commission');
            $margin = $revenue - $devCost - $commission;
            return [
                'id' => (int) $clientId,
                'name' => $first['client_name'],
                'projects_count' => $rows->count(),
                'revenue' => round($revenue, 2),
                'dev_cost' => round($devCost, 2),
                'commission' => round($commission, 2),
                'margin' => round($margin, 2),
                'margin_pct' => $revenue > 0 ? round(($margin / $revenue) * 100, 1) : null,
            ];
        })->values();

        // ─────────── Developers ───────────
        $devs = User::where('role', 'developer')
            ->where('is_active', true)
            ->get(['id', 'name', 'hourly_rate']);

        $devCostByDev = TimeEntry::whereIn('user_id', $devs->pluck('id'))
            ->where('approval_status', 'approved')
            ->whereNotNull('hourly_rate_snapshot')
            ->selectRaw('user_id, SUM(hours) as hours, SUM(hours * hourly_rate_snapshot) as cost')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        // Revenue attributable to each dev = sum of revenues of projects they worked on (simple approach)
        $devProjectRevenue = $projectRows->groupBy('developer_id')->filter(fn ($g, $k) => $k !== null)->map->sum('revenue');

        $devRows = $devs->map(function ($u) use ($devCostByDev, $devProjectRevenue) {
            $stats = $devCostByDev->get($u->id);
            $hours = (float) ($stats->hours ?? 0);
            $cost = (float) ($stats->cost ?? 0);
            $revenueOnProjects = (float) ($devProjectRevenue[$u->id] ?? 0);
            return [
                'id' => $u->id,
                'name' => $u->name,
                'hourly_rate' => (float) ($u->hourly_rate ?? 0),
                'hours_approved' => round($hours, 2),
                'total_cost' => round($cost, 2),
                'revenue_on_projects' => round($revenueOnProjects, 2),
                'contribution_margin' => round($revenueOnProjects - $cost, 2),
            ];
        })->values();

        // ─────────── Partners ───────────
        $partners = \App\Models\ReferralPartner::with('user:id,name')
            ->get();

        $commissionTotalsByPartner = Commission::selectRaw('referral_partner_id, SUM(CASE WHEN status = "paid" THEN commission_amount ELSE 0 END) as paid, SUM(CASE WHEN status IN ("estimated", "confirmed", "scheduled") THEN commission_amount ELSE 0 END) as pending, SUM(CASE WHEN status = "blocked" THEN commission_amount ELSE 0 END) as blocked')
            ->groupBy('referral_partner_id')
            ->get()
            ->keyBy('referral_partner_id');

        $revenueByPartner = $projectRows->groupBy('partner_id')->filter(fn ($g, $k) => $k !== null)->map->sum('revenue');

        $partnerRows = $partners->map(function ($p) use ($commissionTotalsByPartner, $revenueByPartner) {
            $stats = $commissionTotalsByPartner->get($p->id);
            $revenue = (float) ($revenueByPartner[$p->id] ?? 0);
            $paid = (float) ($stats->paid ?? 0);
            $pending = (float) ($stats->pending ?? 0);
            $blocked = (float) ($stats->blocked ?? 0);
            return [
                'id' => $p->id,
                'name' => $p->user?->name ?? '-',
                'revenue_brought' => round($revenue, 2),
                'commission_paid' => round($paid, 2),
                'commission_pending' => round($pending, 2),
                'commission_blocked' => round($blocked, 2),
                'net_margin' => round($revenue - $paid - $pending, 2),
                'commission_rate_effective' => $revenue > 0 ? round((($paid + $pending) / $revenue) * 100, 1) : null,
            ];
        })->sortByDesc('revenue_brought')->values();

        // ─────────── Global summary ───────────
        $totalRevenue = (float) $projectRows->sum('revenue');
        $totalDevCost = (float) $projectRows->sum('dev_cost');
        $totalCommissions = (float) $projectRows->sum('commission');
        $totalMargin = $totalRevenue - $totalDevCost - $totalCommissions;

        $unlocked = $this->financialUnlocked();

        return Inertia::render('Admin/Profitability/Index', [
            'summary' => $unlocked ? [
                'revenue' => round($totalRevenue, 2),
                'dev_cost' => round($totalDevCost, 2),
                'commissions' => round($totalCommissions, 2),
                'margin' => round($totalMargin, 2),
                'margin_pct' => $totalRevenue > 0 ? round(($totalMargin / $totalRevenue) * 100, 1) : null,
            ] : [
                'revenue' => 0, 'dev_cost' => 0, 'commissions' => 0, 'margin' => 0, 'margin_pct' => null,
            ],
            'projects' => $unlocked ? $projectRows : [],
            'clients' => $unlocked ? $clientRows : [],
            'developers' => $unlocked ? $devRows : [],
            'partners' => $unlocked ? $partnerRows : [],
        ]);
    }
}
