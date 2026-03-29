<?php

namespace App\Http\Controllers\Admin;

use App\Models\Projet;
use App\Models\Invoice;
use App\Models\Quote;
use App\Models\Commission;
use App\Models\RecurringService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CalendarController extends BaseAdminController
{
    public function index(Request $request)
    {
        $month = $request->input('month', now()->format('Y-m'));
        $start = Carbon::parse($month . '-01')->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $events = collect();

        // Project deadlines
        Projet::whereNotNull('deadline')
            ->whereBetween('deadline', [$start, $end])
            ->get()
            ->each(function ($p) use ($events) {
                $events->push([
                    'id' => 'proj-' . $p->id,
                    'date' => $p->deadline->format('Y-m-d'),
                    'title' => $p->nom_societe,
                    'subtitle' => 'Project deadline',
                    'type' => 'deadline',
                    'color' => 'red',
                    'url' => "/admin/projects/{$p->id}",
                    'meta' => $p->status,
                ]);
            });

        // Project start dates
        Projet::whereNotNull('start_date')
            ->whereBetween('start_date', [$start, $end])
            ->get()
            ->each(function ($p) use ($events) {
                $events->push([
                    'id' => 'start-' . $p->id,
                    'date' => $p->start_date->format('Y-m-d'),
                    'title' => $p->nom_societe,
                    'subtitle' => 'Project starts',
                    'type' => 'project_start',
                    'color' => 'teal',
                    'url' => "/admin/projects/{$p->id}",
                ]);
            });

        // Invoice due dates
        Invoice::whereNotNull('due_date')
            ->whereBetween('due_date', [$start, $end])
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->get()
            ->each(function ($inv) use ($events) {
                $events->push([
                    'id' => 'inv-' . $inv->id,
                    'date' => Carbon::parse($inv->due_date)->format('Y-m-d'),
                    'title' => $inv->invoice_number,
                    'subtitle' => $inv->client_name . ' - ' . number_format($inv->amount_due, 2) . ' EUR',
                    'type' => 'invoice_due',
                    'color' => $inv->status === 'overdue' ? 'red' : 'amber',
                    'url' => "/admin/invoices/{$inv->id}",
                    'meta' => $inv->status,
                ]);
            });

        // Quote expiry dates
        Quote::whereNotNull('valid_until')
            ->whereBetween('valid_until', [$start, $end])
            ->whereIn('status', ['draft', 'sent', 'viewed'])
            ->get()
            ->each(function ($q) use ($events) {
                $events->push([
                    'id' => 'quote-' . $q->id,
                    'date' => Carbon::parse($q->valid_until)->format('Y-m-d'),
                    'title' => $q->quote_number,
                    'subtitle' => $q->client_name . ' - ' . number_format($q->total, 2) . ' EUR',
                    'type' => 'quote_expiry',
                    'color' => 'violet',
                    'url' => "/admin/quotes/{$q->id}",
                    'meta' => $q->status,
                ]);
            });

        // Commission scheduled payments
        Commission::whereNotNull('scheduled_payment_date')
            ->whereBetween('scheduled_payment_date', [$start, $end])
            ->whereIn('status', ['confirmed', 'scheduled'])
            ->with('referralPartner.user')
            ->get()
            ->each(function ($c) use ($events) {
                $events->push([
                    'id' => 'comm-' . $c->id,
                    'date' => $c->scheduled_payment_date->format('Y-m-d'),
                    'title' => $c->referralPartner?->user?->name ?? 'Partner',
                    'subtitle' => number_format($c->commission_amount, 2) . ' EUR commission',
                    'type' => 'commission',
                    'color' => 'emerald',
                    'url' => "/admin/commissions",
                    'meta' => $c->status,
                ]);
            });

        // Service renewals / expiry
        RecurringService::whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [$start, $end])
            ->with('projet:id,nom_societe')
            ->get()
            ->each(function ($s) use ($events) {
                $events->push([
                    'id' => 'svc-' . $s->id,
                    'date' => $s->expiry_date->format('Y-m-d'),
                    'title' => $s->name,
                    'subtitle' => ($s->projet?->nom_societe ?? '') . ($s->auto_renew ? ' (auto-renew)' : ''),
                    'type' => 'service_expiry',
                    'color' => $s->auto_renew ? 'blue' : 'amber',
                    'url' => "/admin/services",
                    'meta' => $s->status,
                ]);
            });

        // Group events by date
        $grouped = $events->groupBy(fn($e) => $e['date'])->toArray();

        // Upcoming events (next 14 days from today, regardless of month filter)
        $upcomingStart = now()->startOfDay();
        $upcomingEnd = now()->addDays(14)->endOfDay();
        $upcoming = collect();

        // Re-query for upcoming across all types
        Projet::whereNotNull('deadline')
            ->whereBetween('deadline', [$upcomingStart, $upcomingEnd])
            ->get()
            ->each(fn($p) => $upcoming->push([
                'date' => $p->deadline->format('Y-m-d'),
                'title' => $p->nom_societe,
                'type' => 'deadline',
                'color' => 'red',
                'url' => "/admin/projects/{$p->id}",
            ]));

        Invoice::whereNotNull('due_date')
            ->whereBetween('due_date', [$upcomingStart, $upcomingEnd])
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->get()
            ->each(fn($inv) => $upcoming->push([
                'date' => Carbon::parse($inv->due_date)->format('Y-m-d'),
                'title' => $inv->invoice_number . ' - ' . number_format($inv->amount_due, 2) . ' EUR',
                'type' => 'invoice_due',
                'color' => 'amber',
                'url' => "/admin/invoices/{$inv->id}",
            ]));

        RecurringService::whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [$upcomingStart, $upcomingEnd])
            ->with('projet:id,nom_societe')
            ->get()
            ->each(fn($s) => $upcoming->push([
                'date' => $s->expiry_date->format('Y-m-d'),
                'title' => $s->name . ' (' . ($s->projet?->nom_societe ?? '') . ')',
                'type' => 'service_expiry',
                'color' => 'blue',
                'url' => "/admin/services",
            ]));

        return Inertia::render('Admin/Calendar', [
            'events' => $grouped,
            'month' => $month,
            'upcoming' => $upcoming->sortBy('date')->values()->take(10),
        ]);
    }
}
