<?php

namespace App\Http\Controllers\Admin;

use App\Models\FinancialSimulation;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\ProjectBudgetLine;
use App\Models\Projet;
use App\Models\RecurringService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectBudgetController extends BaseAdminController
{
    /**
     * Global revenue page - all projects combined, filterable.
     */
    public function global(Request $request)
    {
        $until = $request->input('until', now()->addMonths(12)->format('Y-m'));
        $untilDate = Carbon::createFromFormat('Y-m', $until)->endOfMonth();

        $allProjects = Projet::select('id', 'nom_societe', 'status', 'start_date', 'end_date', 'deadline')
            ->whereIn('status', ['planning', 'in_progress', 'review', 'completed'])
            ->orderBy('nom_societe')
            ->get();

        // Selected projects (default: all with budget lines)
        $projectsWithBudget = ProjectBudgetLine::distinct()->pluck('project_id')->toArray();
        $selectedIds = $request->input('projects')
            ? array_map('intval', explode(',', $request->input('projects')))
            : $projectsWithBudget;

        if (empty($selectedIds)) $selectedIds = $allProjects->pluck('id')->toArray();

        $allLines = ProjectBudgetLine::whereIn('project_id', $selectedIds)->get();
        $projects = Projet::whereIn('id', $selectedIds)->get();

        // Actual income
        $actualIncome = 0;
        foreach ($selectedIds as $pid) {
            $invoiceIds = Invoice::where('projet_id', $pid)->pluck('id');
            $actualIncome += \App\Models\Payment::whereIn('invoice_id', $invoiceIds)->where('status', 'confirmed')->sum('amount');
        }

        // Also count invoices not linked to projects
        $unlinkedInvoiceIncome = \App\Models\Payment::whereHas('invoice', fn($q) => $q->whereNull('projet_id'))
            ->where('status', 'confirmed')->sum('amount');
        $actualIncome += $unlinkedInvoiceIncome;

        // Actual expenses
        $actualExpenses = 0;
        $services = RecurringService::whereIn('projet_id', $selectedIds)->get();
        foreach ($services as $svc) {
            if (!$svc->purchase_date) continue;
            $months = max(1, Carbon::parse($svc->purchase_date)->diffInMonths(now()));
            $actualExpenses += $svc->real_cost * $months;
        }

        // Projection range
        $earliestDate = $allLines->min('start_date') ?? $allLines->min('created_at');
        $projectStart = $projects->min('start_date');
        $rangeStart = Carbon::parse($projectStart ?? $earliestDate ?? now()->subMonths(3))->startOfMonth();

        // Build projection
        $projection = [];
        $cumulative = 0;
        $breakEvenMonth = null;
        $prevCumulative = null;
        $cursor = $rangeStart->copy();

        while ($cursor->lte($untilDate)) {
            $monthKey = $cursor->format('Y-m');
            $income = 0;
            $expense = 0;

            foreach ($allLines as $line) {
                $active = $this->isLineActiveInMonth($line, $cursor, $projects->firstWhere('id', $line->project_id));
                if (!$active) continue;
                if ($line->type === 'income') $income += (float) $line->amount;
                else $expense += (float) $line->amount;
            }

            $net = $income - $expense;
            $cumulative += $net;
            $projection[] = ['month' => $monthKey, 'income' => round($income, 2), 'expense' => round($expense, 2), 'net' => round($net, 2), 'cumulative' => round($cumulative, 2)];

            if ($breakEvenMonth === null && $prevCumulative !== null && $prevCumulative < 0 && $cumulative >= 0) {
                $breakEvenMonth = $monthKey;
            }
            $prevCumulative = $cumulative;
            $cursor->addMonth();
        }

        // All budget lines for the table (grouped by project)
        $budgetLines = ProjectBudgetLine::whereIn('project_id', $selectedIds)
            ->with('project:id,nom_societe')
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        // ── ANALYTICS DATA ──

        // 1. Revenue by month (last 12 months) - actual payments
        $revenueByMonth = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = now()->subMonths($i)->startOfMonth();
            $monthEnd = now()->subMonths($i)->endOfMonth();
            $monthLabel = $monthStart->format('M Y');
            $monthKey = $monthStart->format('Y-m');

            $income = \App\Models\Payment::where('status', 'confirmed')
                ->whereBetween('payment_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $invoiced = Invoice::whereBetween('issue_date', [$monthStart, $monthEnd])
                ->sum('total');

            $revenueByMonth[] = [
                'month' => $monthKey,
                'label' => $monthLabel,
                'income' => round($income, 2),
                'invoiced' => round($invoiced, 2),
            ];
        }

        // 2. Lead conversion by source
        $leadsBySource = \App\Models\Lead::selectRaw('source, COUNT(*) as total, SUM(CASE WHEN status = "won" THEN 1 ELSE 0 END) as won')
            ->groupBy('source')
            ->get()
            ->map(fn($row) => [
                'source' => $row->source ?: 'unknown',
                'total' => $row->total,
                'won' => $row->won,
                'rate' => $row->total > 0 ? round(($row->won / $row->total) * 100, 1) : 0,
            ]);

        // 3. Projects by status
        $projectsByStatus = Projet::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(fn($row) => [$row->status => $row->count]);

        // 4. Month over month comparison
        $thisMonth = \App\Models\Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('amount');

        $lastMonth = \App\Models\Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])
            ->sum('amount');

        $momChange = $lastMonth > 0 ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1) : ($thisMonth > 0 ? 100 : 0);

        // 5. Top clients by revenue (top 5)
        $topClients = Invoice::where('status', 'paid')
            ->selectRaw('client_name, client_company, SUM(total) as total_revenue, COUNT(*) as invoice_count')
            ->groupBy('client_name', 'client_company')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get();

        // 6. Commission stats
        $commissionStats = [
            'total_paid' => \App\Models\Commission::where('status', 'paid')->sum('commission_amount'),
            'total_pending' => \App\Models\Commission::whereIn('status', ['estimated', 'confirmed', 'scheduled'])->sum('commission_amount'),
            'total_all' => \App\Models\Commission::sum('commission_amount'),
        ];

        $unlocked = $this->financialUnlocked();

        return Inertia::render('Admin/Revenue/Index', [
            'projection' => $unlocked ? $projection : [],
            'breakEvenMonth' => $unlocked ? $breakEvenMonth : null,
            'actualIncome' => $unlocked ? round($actualIncome, 2) : 0,
            'actualExpenses' => $unlocked ? round($actualExpenses, 2) : 0,
            'until' => $until,
            'allProjects' => $allProjects,
            'selectedProjectIds' => $selectedIds,
            'budgetLines' => $unlocked ? $budgetLines : [],
            'revenueByMonth' => $unlocked ? $revenueByMonth : [],
            'leadsBySource' => $leadsBySource,
            'projectsByStatus' => $projectsByStatus,
            'thisMonthRevenue' => $unlocked ? round($thisMonth, 2) : 0,
            'lastMonthRevenue' => $unlocked ? round($lastMonth, 2) : 0,
            'momChange' => $unlocked ? $momChange : 0,
            'topClients' => $unlocked ? $topClients : [],
            'commissionStats' => $unlocked ? $commissionStats : ['total_paid' => 0, 'total_pending' => 0, 'total_all' => 0],
            'simulations' => FinancialSimulation::with('product:id,name')
                ->orderByDesc('updated_at')
                ->get()
                ->map(function ($sim) {
                    $proj = $sim->computeProjection();
                    return [
                        'id' => $sim->id,
                        'name' => $sim->name,
                        'product_name' => $sim->product_name ?: ($sim->product->name ?? null),
                        'monthly_price' => $sim->monthly_price,
                        'time_horizon' => $sim->time_horizon,
                        'team_member_count' => count($sim->team_members ?? []),
                        'updated_at' => $sim->updated_at?->toISOString(),
                        'total_projected_revenue' => $proj['total_revenue'],
                        'total_profit' => $proj['total_profit'],
                        'break_even_month' => $proj['break_even_month'],
                    ];
                }),
            'simulatorProducts' => Product::select('id', 'name', 'pricing_monthly')->orderBy('name')->get(),
        ]);
    }

    public function index(Request $request, Projet $project)
    {
        $until = $request->input('until', now()->addMonths(12)->format('Y-m'));
        $untilDate = Carbon::createFromFormat('Y-m', $until)->endOfMonth();

        // Multi-project support
        $selectedIds = $request->input('projects')
            ? array_map('intval', explode(',', $request->input('projects')))
            : [$project->id];

        // Load budget lines for all selected projects
        $allLines = ProjectBudgetLine::whereIn('project_id', $selectedIds)->get();
        $projects = Projet::whereIn('id', $selectedIds)->get();

        // Actual income: confirmed payments on invoices linked to these projects
        $actualIncome = 0;
        foreach ($selectedIds as $pid) {
            $invoiceIds = Invoice::where('projet_id', $pid)->pluck('id');
            $actualIncome += \App\Models\Payment::whereIn('invoice_id', $invoiceIds)
                ->where('status', 'confirmed')
                ->sum('amount');
        }

        // Actual expenses: recurring services cost
        $actualExpenses = 0;
        $services = RecurringService::whereIn('projet_id', $selectedIds)->get();
        foreach ($services as $svc) {
            if (!$svc->purchase_date) continue;
            $months = max(1, Carbon::parse($svc->purchase_date)->diffInMonths(now()));
            $actualExpenses += $svc->real_cost * $months;
        }

        // Determine projection range
        $earliestDate = $allLines->min('start_date') ?? $allLines->min('created_at');
        $projectStart = $projects->min('start_date');
        $rangeStart = Carbon::parse($projectStart ?? $earliestDate ?? now()->subMonths(3))->startOfMonth();
        $rangeEnd = $untilDate;

        // Build projection
        $projection = [];
        $cumulative = 0;
        $breakEvenMonth = null;
        $prevCumulative = null;

        $cursor = $rangeStart->copy();
        while ($cursor->lte($rangeEnd)) {
            $monthKey = $cursor->format('Y-m');
            $income = 0;
            $expense = 0;

            foreach ($allLines as $line) {
                $active = $this->isLineActiveInMonth($line, $cursor, $projects->firstWhere('id', $line->project_id));
                if (!$active) continue;

                if ($line->type === 'income') {
                    $income += (float) $line->amount;
                } else {
                    $expense += (float) $line->amount;
                }
            }

            $net = $income - $expense;
            $cumulative += $net;

            $projection[] = [
                'month' => $monthKey,
                'income' => round($income, 2),
                'expense' => round($expense, 2),
                'net' => round($net, 2),
                'cumulative' => round($cumulative, 2),
            ];

            // Detect break-even
            if ($breakEvenMonth === null && $prevCumulative !== null && $prevCumulative < 0 && $cumulative >= 0) {
                $breakEvenMonth = $monthKey;
            }
            $prevCumulative = $cumulative;

            $cursor->addMonth();
        }

        $allProjects = Projet::select('id', 'nom_societe', 'status')
            ->whereIn('status', ['planning', 'in_progress', 'review', 'completed'])
            ->orderBy('nom_societe')
            ->get();

        return Inertia::render('Admin/Projects/Budget', [
            'project' => $project,
            'budgetLines' => $project->budgetLines()->orderBy('type')->orderBy('sort_order')->get(),
            'projection' => $projection,
            'breakEvenMonth' => $breakEvenMonth,
            'actualIncome' => round($actualIncome, 2),
            'actualExpenses' => round($actualExpenses, 2),
            'until' => $until,
            'allProjects' => $allProjects,
            'selectedProjectIds' => $selectedIds,
        ]);
    }

    private function isLineActiveInMonth(ProjectBudgetLine $line, Carbon $month, ?Projet $project): bool
    {
        $monthStart = $month->copy()->startOfMonth();
        $monthEnd = $month->copy()->endOfMonth();

        // Determine the activation date
        $activationDate = match ($line->trigger) {
            'immediate' => Carbon::parse($line->created_at)->startOfMonth(),
            'from_date' => $line->start_date ? $line->start_date->copy()->startOfMonth() : null,
            'on_project_completed' => $this->getCompletionDate($project)?->startOfMonth(),
            default => null,
        };

        if (!$activationDate) return false;
        if ($monthStart->lt($activationDate)) return false;

        // Check end_date
        if ($line->end_date && $monthStart->gt($line->end_date)) return false;

        // Frequency check
        return match ($line->frequency) {
            'one_time' => $monthStart->eq($activationDate),
            'monthly' => true,
            'quarterly' => $activationDate->diffInMonths($monthStart) % 3 === 0,
            'annual' => $activationDate->diffInMonths($monthStart) % 12 === 0,
            default => false,
        };
    }

    private function getCompletionDate(?Projet $project): ?Carbon
    {
        if (!$project) return null;
        if ($project->status === 'completed' && $project->end_date) return Carbon::parse($project->end_date);
        if ($project->deadline) return Carbon::parse($project->deadline);
        return null;
    }

    public function store(Request $request, Projet $project)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:one_time,monthly,quarterly,annual',
            'trigger' => 'required|in:immediate,from_date,on_project_completed',
            'start_date' => 'required_if:trigger,from_date|nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_confirmed' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['project_id'] = $project->id;
        ProjectBudgetLine::create($validated);

        return redirect()->back()->with('success', 'Budget line added.');
    }

    public function update(Request $request, Projet $project, ProjectBudgetLine $line)
    {
        if ($line->project_id !== $project->id) abort(403);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:one_time,monthly,quarterly,annual',
            'trigger' => 'required|in:immediate,from_date,on_project_completed',
            'start_date' => 'required_if:trigger,from_date|nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_confirmed' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $line->update($validated);

        return redirect()->back()->with('success', 'Budget line updated.');
    }

    public function destroy(Projet $project, ProjectBudgetLine $line)
    {
        if ($line->project_id !== $project->id) abort(403);
        $line->delete();
        return redirect()->back()->with('success', 'Budget line removed.');
    }
}
