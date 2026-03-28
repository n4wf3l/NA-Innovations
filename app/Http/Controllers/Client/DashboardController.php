<?php

namespace App\Http\Controllers\Client;

use App\Models\Quote;
use App\Models\Invoice;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $projects = $user->clientProjects()->latest('updated_at')->get();

        // If client has exactly 1 project, redirect straight to it
        if ($projects->count() === 1) {
            return redirect()->route('client.projects.show', $projects->first());
        }

        $clientScope = fn($q) => $q->where('client_id', $user->id)->orWhere('client_email', $user->email);

        $pendingQuotes = Quote::where($clientScope)->whereIn('status', ['sent', 'viewed'])->get();
        $unpaidInvoices = Invoice::where($clientScope)->whereIn('status', ['sent', 'overdue', 'partially_paid'])->get();

        $stats = [
            'activeProjects' => $projects->whereIn('status', ['planning', 'in_progress', 'review'])->count(),
            'totalProjects' => $projects->count(),
            'pendingQuotes' => $pendingQuotes->count(),
            'unpaidInvoices' => $unpaidInvoices->count(),
            'totalDue' => $unpaidInvoices->sum('amount_due'),
        ];

        return Inertia::render('Client/Dashboard', [
            'projects' => $projects,
            'pendingQuotes' => $pendingQuotes,
            'unpaidInvoices' => $unpaidInvoices,
            'stats' => $stats,
        ]);
    }
}
