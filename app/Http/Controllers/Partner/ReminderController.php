<?php

namespace App\Http\Controllers\Partner;

use App\Models\PartnerReminder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class ReminderController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'referral']);
    }

    public function index()
    {
        $reminders = PartnerReminder::where('user_id', auth()->id())
            ->orderByRaw("CASE WHEN status = 'pending' THEN 0 ELSE 1 END")
            ->orderBy('remind_at')
            ->get();

        $upcoming = $reminders->where('status', 'pending')->where('remind_at', '>', now())->count();
        $overdue = $reminders->where('status', 'pending')->where('remind_at', '<=', now())->count();

        return Inertia::render('Partner/Reminders', [
            'reminders' => $reminders,
            'stats' => [
                'total' => $reminders->count(),
                'upcoming' => $upcoming,
                'overdue' => $overdue,
                'completed' => $reminders->where('status', 'sent')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'remind_at' => 'required|date|after:now',
            'send_email_notification' => 'nullable|boolean',
            'lead_id' => 'nullable|exists:leads,id',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['send_email_notification'] = $validated['send_email_notification'] ?? true;

        PartnerReminder::create($validated);

        return redirect()->back()->with('success', __('Rappel créé avec succès.'));
    }

    public function update(Request $request, PartnerReminder $reminder)
    {
        if ($reminder->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'remind_at' => 'required|date',
            'send_email_notification' => 'nullable|boolean',
        ]);

        $reminder->update($validated);

        return redirect()->back()->with('success', __('Rappel mis à jour.'));
    }

    public function dismiss(PartnerReminder $reminder)
    {
        if ($reminder->user_id !== auth()->id()) abort(403);

        $reminder->update([
            'status' => 'dismissed',
            'dismissed_at' => now(),
        ]);

        return redirect()->back()->with('success', __('Rappel fermé.'));
    }

    public function destroy(PartnerReminder $reminder)
    {
        if ($reminder->user_id !== auth()->id()) abort(403);

        $reminder->delete();

        return redirect()->back()->with('success', __('Rappel supprimé.'));
    }
}
