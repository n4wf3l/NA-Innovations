<?php

namespace App\Http\Controllers\Client;

use App\Models\SupportTicket;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $tickets = SupportTicket::where('client_id', Auth::id())
            ->with(['project', 'replier', 'messages.user'])
            ->latest()
            ->get();

        $projects = Auth::user()->clientProjects()->get();

        return Inertia::render('Client/Support', [
            'tickets' => $tickets,
            'projects' => $projects,
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        if ($ticket->client_id !== Auth::id()) {
            abort(403);
        }

        $ticket->load(['messages.user', 'project']);

        return Inertia::render('Client/Support/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'project_id' => 'nullable|exists:projets,id',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $ticket = SupportTicket::create([
            'client_id' => Auth::id(),
            'project_id' => $validated['project_id'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'open',
            'priority' => $validated['priority'] ?? 'medium',
        ]);

        // Create the initial message in the conversation thread
        $ticket->messages()->create([
            'user_id' => Auth::id(),
            'message' => $validated['message'],
            'is_admin' => false,
        ]);

        // Notify admins
        NotificationService::sendToAdmins('support-ticket', [
            'client_name' => Auth::user()->name,
            'subject' => $validated['subject'],
        ], actionUrl: '/admin/support');

        return redirect()->back()->with('success', 'Votre demande a été envoyée. Nous vous répondrons rapidement.');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        if ($ticket->client_id !== Auth::id()) {
            abort(403);
        }

        if ($ticket->status === 'closed') {
            return redirect()->back()->with('error', 'Ce ticket est fermé.');
        }

        $request->validate(['message' => 'required|string|max:5000']);

        $ticket->messages()->create([
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => false,
        ]);

        // Reopen if resolved
        if ($ticket->status === 'resolved') {
            $ticket->update(['status' => 'open']);
        }

        // Notify admins
        NotificationService::sendToAdmins('support-ticket', [
            'client_name' => Auth::user()->name,
            'subject' => $ticket->subject . ' (réponse)',
        ], actionUrl: "/admin/support/{$ticket->id}");

        return redirect()->back()->with('success', 'Réponse envoyée.');
    }
}
