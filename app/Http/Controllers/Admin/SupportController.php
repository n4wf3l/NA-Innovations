<?php

namespace App\Http\Controllers\Admin;

use App\Models\SupportTicket;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends BaseAdminController
{
    public function index(Request $request)
    {
        $query = SupportTicket::with(['client', 'project', 'replier'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => SupportTicket::count(),
            'open' => SupportTicket::where('status', 'open')->count(),
            'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved' => SupportTicket::where('status', 'resolved')->count(),
        ];

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only('status', 'priority'),
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        $ticket->load(['client', 'project', 'replier', 'messages.user']);

        return Inertia::render('Admin/Support/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $ticket->messages()->create([
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'is_admin' => true,
        ]);

        $ticket->update([
            'status' => $validated['status'],
            'replied_at' => now(),
            'replied_by' => auth()->id(),
        ]);

        // Notify client that their ticket got a reply
        if ($ticket->client) {
            NotificationService::send($ticket->client, 'support-reply', [
                'client_name' => $ticket->client->name,
                'ticket_subject' => $ticket->subject,
                'admin_reply' => $validated['message'],
            ], transactional: true, actionUrl: '/client/support');
        }

        return redirect()->back()->with('success', 'Réponse envoyée au client.');
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $request->validate(['status' => 'required|in:open,in_progress,resolved,closed']);
        $ticket->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(SupportTicket $ticket)
    {
        $ticket->delete();

        return redirect()->route('admin.support.index')->with('success', 'Ticket supprimé.');
    }
}
