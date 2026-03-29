<?php
namespace App\Http\Controllers\Dev;

use App\Models\Projet;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        // Projects assigned to this developer
        $myProjects = Projet::where('developer_id', $user->id)
            ->with('client')
            ->latest()
            ->get();

        // Pending projects (no developer assigned, status = planning)
        $pendingProjects = Projet::whereNull('developer_id')
            ->where('status', 'planning')
            ->with('client', 'lead.referralPartner.user')
            ->latest()
            ->get();

        $stats = [
            'myActive' => $myProjects->whereIn('status', ['in_progress', 'review'])->count(),
            'myCompleted' => $myProjects->where('status', 'completed')->count(),
            'pendingClaim' => $pendingProjects->count(),
            'totalAssigned' => $myProjects->count(),
        ];

        // Monthly completed projects for last 6 months
        $monthlyCompleted = [];
        for ($i = 5; $i >= 0; $i--) {
            $start = now()->subMonths($i)->startOfMonth();
            $end = now()->subMonths($i)->endOfMonth();
            $monthlyCompleted[] = [
                'month' => $start->format('M'),
                'count' => Projet::where('developer_id', $user->id)->where('status', 'completed')
                    ->whereBetween('end_date', [$start, $end])->count(),
            ];
        }

        $totalBudgetManaged = Projet::where('developer_id', $user->id)->sum('budget');

        return Inertia::render('Dev/Dashboard', [
            'myProjects' => $myProjects,
            'pendingProjects' => $pendingProjects,
            'stats' => $stats,
            'monthlyCompleted' => $monthlyCompleted,
            'totalBudgetManaged' => $totalBudgetManaged,
        ]);
    }
}
