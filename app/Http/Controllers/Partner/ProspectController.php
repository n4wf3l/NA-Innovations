<?php

namespace App\Http\Controllers\Partner;

use App\Models\PartnerProspect;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ProspectController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'referral']);
    }

    public function index()
    {
        $prospects = PartnerProspect::forUser(auth()->id())
            ->orderBy('updated_at', 'desc')
            ->get();

        $columns = ['a_contacter', 'contacte', 'interesse', 'pas_maintenant', 'soumis'];
        $kanbanProspects = [];
        foreach ($columns as $col) {
            $kanbanProspects[$col] = $prospects->where('status', $col)->values()->toArray();
        }

        $stats = [
            'total' => $prospects->count(),
            'with_follow_up' => $prospects->whereNotNull('follow_up_date')->count(),
            'overdue' => $prospects->filter(fn($p) =>
                $p->follow_up_date && $p->follow_up_date->isPast() && !$p->follow_up_notified && $p->status !== 'soumis'
            )->count(),
            'submitted' => $prospects->where('status', 'soumis')->count(),
        ];

        return Inertia::render('Partner/Prospects/Index', [
            'kanbanProspects' => $kanbanProspects,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'status' => 'required|in:a_contacter,contacte,interesse,pas_maintenant,soumis',
            'follow_up_date' => 'nullable|date',
            'send_email_reminder' => 'nullable|boolean',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['send_email_reminder'] = $validated['send_email_reminder'] ?? true;

        PartnerProspect::create($validated);

        return back()->with('success', 'Prospect ajouté.');
    }

    public function update(Request $request, PartnerProspect $prospect)
    {
        if ($prospect->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'status' => 'required|in:a_contacter,contacte,interesse,pas_maintenant,soumis',
            'follow_up_date' => 'nullable|date',
            'send_email_reminder' => 'nullable|boolean',
        ]);

        if ($prospect->follow_up_date?->toDateString() !== ($validated['follow_up_date'] ?? null)) {
            $validated['follow_up_notified'] = false;
        }

        $prospect->update($validated);

        return back()->with('success', 'Prospect mis à jour.');
    }

    public function updateStatus(Request $request, PartnerProspect $prospect)
    {
        if ($prospect->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'status' => 'required|in:a_contacter,contacte,interesse,pas_maintenant,soumis',
        ]);

        $prospect->update(['status' => $validated['status']]);

        return response()->json(['ok' => true]);
    }

    public function destroy(PartnerProspect $prospect)
    {
        if ($prospect->user_id !== auth()->id()) abort(403);

        $prospect->delete();

        return back()->with('success', 'Prospect supprimé.');
    }
}
