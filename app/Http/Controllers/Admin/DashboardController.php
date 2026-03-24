<?php

namespace App\Http\Controllers\Admin;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Projet;
use App\Models\RecurringService;
use Illuminate\Http\Request;

class DashboardController extends BaseAdminController
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();

        // Revenue this month (confirmed payments)
        $revenueMonth = Payment::where('status', 'confirmed')
            ->whereBetween('payment_date', [$startOfMonth, $now])
            ->sum('amount');

        // Active projects
        $activeProjects = Projet::whereIn('status', ['planning', 'in_progress', 'review'])->count();

        // Open leads
        $openLeads = Lead::whereNotIn('status', ['won', 'lost'])->count();

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

        return view('admin.dashboard', compact(
            'revenueMonth', 'activeProjects', 'openLeads', 'pendingInvoices',
            'recentLeads', 'overdueInvoices', 'expiringServices', 'pendingCommissions'
        ));
    }
}
