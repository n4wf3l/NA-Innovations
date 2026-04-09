<?php

namespace App\Http\Controllers\Client;

use App\Models\Quote;
use App\Models\Invoice;
use App\Models\SentEmail;
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
        // SECURITY: hide internal fields from client
        $projects->each->makeHidden(['project_credentials', 'project_env', 'estimated_hours', 'github_repo']);

        // If client has exactly 1 project, redirect straight to it (preserve flash for splash)
        if ($projects->count() === 1) {
            $redirect = redirect()->route('client.projects.show', $projects->first());
            if (session('success')) {
                $redirect->with('success', session('success'));
            }
            return $redirect;
        }

        $clientScope = fn($q) => $q->where('client_id', $user->id)->orWhere('client_email', $user->email);

        $pendingQuotes = Quote::where($clientScope)->whereIn('status', ['sent', 'viewed'])->get();
        $unpaidInvoices = Invoice::where($clientScope)->whereIn('status', ['sent', 'overdue', 'partially_paid'])->get();

        // Emails sent to this client
        $sentEmails = SentEmail::where('recipient_email', $user->email)
            ->latest('sent_at')
            ->take(10)
            ->get();

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
            'sentEmails' => $sentEmails,
            'stats' => $stats,
            'hasTestimonial' => \App\Models\Testimonial::where('user_id', auth()->id())->exists(),
        ]);
    }
}
