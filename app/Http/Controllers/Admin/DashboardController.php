<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Projet;
use App\Models\RecurringService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends BaseAdminController
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // Revenue this month (confirmed payments)
        $revenueMonth = Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [$startOfMonth, $now])
            ->sum('amount');

        // Revenue last month
        $revenueLastMonth = Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');

        // Active projects
        $activeProjects = Projet::whereIn('status', ['planning', 'in_progress', 'review'])->count();

        // Open leads + last month comparison
        $openLeads = Lead::whereNotIn('status', ['won', 'lost'])->count();
        $newLeadsThisMonth = Lead::where('created_at', '>=', $startOfMonth)->count();
        $newLeadsLastMonth = Lead::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        // Won leads this month vs last
        $wonThisMonth = Lead::where('status', 'won')->where('won_at', '>=', $startOfMonth)->count();
        $wonLastMonth = Lead::where('status', 'won')->whereBetween('won_at', [$startOfLastMonth, $endOfLastMonth])->count();

        // Pending invoices (sent but unpaid)
        $pendingInvoices = Invoice::whereIn('status', ['sent', 'viewed', 'partially_paid', 'overdue'])->sum('amount_due');

        // Recent leads
        $recentLeads = Lead::with('referralPartner.user')->latest()->take(5)->get();

        // Overdue invoices
        $overdueInvoices = Invoice::where('status', 'overdue')
            ->orWhere(function ($q) use ($now) {
                $q->whereIn('status', ['sent', 'viewed'])->where('due_date', '<', $now);
            })->with('client')->take(5)->get();

        // Services expiring soon (30 days)
        $expiringServices = RecurringService::where('status', 'active')
            ->where('expiry_date', '<=', $now->copy()->addDays(30))
            ->with('client')->take(5)->get();

        // Commissions to pay
        $pendingCommissions = Commission::whereIn('status', ['confirmed', 'scheduled'])->sum('commission_amount');

        // All active projects with partner info for box view
        $projects = Projet::with(['client', 'developer', 'lead.referralPartner.user'])
            ->whereIn('status', ['planning', 'in_progress', 'review', 'completed'])
            ->latest('updated_at')
            ->take(12)
            ->get();

        // Comparisons
        $revenueChange = $revenueLastMonth > 0
            ? round(($revenueMonth - $revenueLastMonth) / $revenueLastMonth * 100, 1)
            : ($revenueMonth > 0 ? 100 : 0);

        $leadsChange = $newLeadsLastMonth > 0
            ? round(($newLeadsThisMonth - $newLeadsLastMonth) / $newLeadsLastMonth * 100, 1)
            : ($newLeadsThisMonth > 0 ? 100 : 0);

        // Dashboard layout preferences
        $dashboardPrefs = auth()->user()->preferences['dashboard_layout'] ?? [
            'kpis' => true,
            'quick_actions' => true,
            'projects' => true,
            'recent_leads' => true,
            'alerts' => true,
        ];

        // Email notification preference
        $notifyAdminEmails = auth()->user()->preferences['notifications']['notify_admin_emails'] ?? true;

        // Activity chart — last 24 hours, grouped by hour
        $activityData = \App\Models\ActivityLog::where('created_at', '>=', now()->subHours(24))
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m-%d %H:00:00') as hour, COUNT(*) as count")
            ->groupBy('hour')
            ->orderBy('hour')
            ->pluck('count', 'hour')
            ->toArray();

        $activityChart = [];
        for ($i = 23; $i >= 0; $i--) {
            $h = now()->subHours($i)->format('Y-m-d H:00:00');
            $activityChart[] = [
                'hour' => now()->subHours($i)->format('H:00'),
                'count' => $activityData[$h] ?? 0,
            ];
        }
        $activityNow = $activityChart[count($activityChart) - 1]['count'] ?? 0;
        $activityPeak = collect($activityChart)->max('count');
        $activityPeakHour = collect($activityChart)->sortByDesc('count')->first()['hour'] ?? '--';
        $activityTotal = collect($activityChart)->sum('count');

        $unlocked = $this->financialUnlocked();

        return Inertia::render('Admin/Dashboard', [
            'revenueMonth' => $unlocked ? $revenueMonth : 0,
            'revenueLastMonth' => $unlocked ? $revenueLastMonth : 0,
            'revenueChange' => $unlocked ? $revenueChange : 0,
            'activeProjects' => $activeProjects,
            'openLeads' => $openLeads,
            'newLeadsThisMonth' => $newLeadsThisMonth,
            'leadsChange' => $leadsChange,
            'wonThisMonth' => $wonThisMonth,
            'wonLastMonth' => $wonLastMonth,
            'pendingInvoices' => $unlocked ? $pendingInvoices : 0,
            'recentLeads' => $recentLeads,
            'overdueInvoices' => $unlocked ? $overdueInvoices : [],
            'expiringServices' => $unlocked ? $expiringServices : [],
            'pendingCommissions' => $unlocked ? $pendingCommissions : 0,
            'projects' => $projects,
            'dashboardPrefs' => $dashboardPrefs,
            'notifyAdminEmails' => $notifyAdminEmails,
            'activityChart' => $activityChart,
            'activityNow' => $activityNow,
            'activityPeak' => $activityPeak,
            'activityPeakHour' => $activityPeakHour,
            'activityTotal' => $activityTotal,
        ]);
    }

    /**
     * Update dashboard layout preferences and notification settings.
     */
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'dashboard_layout' => 'required|array',
            'notify_admin_emails' => 'nullable|boolean',
        ]);

        $user = auth()->user();
        $prefs = $user->preferences ?? [];
        $prefs['dashboard_layout'] = $validated['dashboard_layout'];

        // Save email notification preference
        if ($request->has('notify_admin_emails')) {
            if (!isset($prefs['notifications'])) {
                $prefs['notifications'] = [];
            }
            $prefs['notifications']['notify_admin_emails'] = (bool) $validated['notify_admin_emails'];
        }

        $user->update(['preferences' => $prefs]);

        return response()->json(['success' => true]);
    }
}
