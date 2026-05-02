<?php

namespace App\Http\Controllers\Admin;

use App\Models\RecurringService;
use App\Models\ServiceRenewal;
use App\Models\User;
use App\Models\Projet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecurringServiceController extends BaseAdminController
{
    /**
     * Display a listing of recurring services with filters.
     */
    public function index(Request $request)
    {
        $query = RecurringService::with('client', 'projet');

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by client
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('provider', 'like', "%{$search}%");
            });
        }

        $services = $query->orderBy('expiry_date', 'asc')->paginate(15)->withQueryString();

        $totalServices = RecurringService::count();
        $activeServices = RecurringService::where('status', 'active')->count();
        $monthlyRevenue = RecurringService::where('status', 'active')->sum('billed_price');
        $totalMargin = RecurringService::where('status', 'active')
            ->selectRaw('SUM(billed_price - real_cost) as margin')
            ->value('margin') ?? 0;

        $unlocked = $this->financialUnlocked();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'totalServices' => $totalServices,
            'activeServices' => $activeServices,
            'monthlyRevenue' => $unlocked ? $monthlyRevenue : 0,
            'totalMargin' => $unlocked ? $totalMargin : 0,
        ]);
    }

    /**
     * Show the form for creating a new recurring service.
     */
    public function create()
    {
        $clients = User::where('role', 'client')->orderBy('name')->get();
        $projects = Projet::orderBy('nom_societe')->get();

        return Inertia::render('Admin/Services/Create', [
            'clients' => $clients,
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created recurring service.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:domain,hosting,ssl,email,saas,maintenance,support,other',
            'provider' => 'nullable|string|max:255',
            'provider_account' => 'nullable|string|max:255',
            'provider_reference' => 'nullable|string|max:255',
            'client_id' => 'nullable|exists:users,id',
            'projet_id' => 'nullable|exists:projets,id',
            'purchase_date' => 'nullable|date',
            'expiry_date' => 'required|date',
            'frequency' => 'required|string|in:monthly,quarterly,semi_annual,annual,biennial',
            'real_cost' => 'required|numeric|min:0',
            'billed_price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'status' => 'nullable|string|in:active,expiring_soon,expired,cancelled,suspended',
            'payment_mode' => 'nullable|string|in:manual,automatic,client_direct',
            'auto_renew' => 'nullable|boolean',
            'alert_days_before' => 'nullable|integer|min:0',
            'login_url' => 'nullable|url|max:500',
            'credentials_note' => 'nullable|string',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['auto_renew'] = $request->boolean('auto_renew');
        $validated['status'] = $validated['status'] ?? 'active';

        RecurringService::create($validated);

        return redirect()->route('admin.services.index')->with('success', 'Recurring service created successfully.');
    }

    /**
     * Display the specified recurring service.
     */
    public function show(RecurringService $service)
    {
        $service->load('client', 'projet', 'renewals', 'notes.user');

        if (!$this->financialUnlocked()) {
            foreach (['real_cost', 'billed_price'] as $f) {
                if (isset($service->$f)) $service->$f = 0;
            }
        }

        return Inertia::render('Admin/Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified recurring service.
     */
    public function edit(RecurringService $service)
    {
        if (!$this->financialUnlocked()) {
            return redirect()->route('admin.services.show', $service)
                ->with('error', __('Déverrouille le PIN financier pour modifier les montants.'));
        }

        $clients = User::where('role', 'client')->orderBy('name')->get();
        $projects = Projet::orderBy('nom_societe')->get();

        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
            'clients' => $clients,
            'projects' => $projects,
        ]);
    }

    /**
     * Update the specified recurring service.
     */
    public function update(Request $request, RecurringService $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:domain,hosting,ssl,email,saas,maintenance,support,other',
            'provider' => 'nullable|string|max:255',
            'provider_account' => 'nullable|string|max:255',
            'provider_reference' => 'nullable|string|max:255',
            'client_id' => 'nullable|exists:users,id',
            'projet_id' => 'nullable|exists:projets,id',
            'purchase_date' => 'nullable|date',
            'expiry_date' => 'required|date',
            'frequency' => 'required|string|in:monthly,quarterly,semi_annual,annual,biennial',
            'real_cost' => 'required|numeric|min:0',
            'billed_price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'status' => 'nullable|string|in:active,expiring_soon,expired,cancelled,suspended',
            'payment_mode' => 'nullable|string|in:manual,automatic,client_direct',
            'auto_renew' => 'nullable|boolean',
            'alert_days_before' => 'nullable|integer|min:0',
            'login_url' => 'nullable|url|max:500',
            'credentials_note' => 'nullable|string',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['auto_renew'] = $request->boolean('auto_renew');

        $service->update($validated);

        return redirect()->route('admin.services.show', $service)->with('success', 'Recurring service updated successfully.');
    }

    /**
     * Soft delete the specified recurring service.
     */
    public function destroy(RecurringService $service)
    {
        $service->delete();

        return redirect()->route('admin.services.index')->with('success', 'Recurring service deleted successfully.');
    }

    /**
     * Renew a recurring service.
     */
    public function renew(RecurringService $service)
    {
        $oldExpiry = $service->expiry_date;

        // Calculate new expiry based on frequency
        $newExpiry = match($service->frequency) {
            'monthly' => $oldExpiry->addMonth(),
            'quarterly' => $oldExpiry->addMonths(3),
            'semi_annual' => $oldExpiry->addMonths(6),
            'annual' => $oldExpiry->addYear(),
            'biennial' => $oldExpiry->addYears(2),
            default => $oldExpiry->addYear(),
        };

        // Create renewal record
        ServiceRenewal::create([
            'recurring_service_id' => $service->id,
            'renewal_date' => now()->toDateString(),
            'new_expiry_date' => $newExpiry->toDateString(),
            'cost' => $service->real_cost,
            'billed_amount' => $service->billed_price,
            'status' => 'completed',
        ]);

        // Update service expiry
        $service->update([
            'expiry_date' => $newExpiry->toDateString(),
            'status' => 'active',
        ]);

        // If project was on_hold due to suspension, reactivate it
        if ($service->projet_id) {
            $project = \App\Models\Projet::find($service->projet_id);
            if ($project && $project->status === 'on_hold') {
                $project->update(['status' => 'completed']);
                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'status_change',
                    'title' => 'Projet réactivé - service renouvelé',
                    'description' => "Le service {$service->name} a été renouvelé. Le projet est remis en ligne.",
                ]);
            }
        }

        return redirect()->back()->with('success', 'Service renouvelé avec succès.');
    }

    /**
     * Update service status (suspend / reactivate).
     */
    public function updateStatus(Request $request, RecurringService $service)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,suspended',
        ]);

        $service->update(['status' => $validated['status']]);

        if ($validated['status'] === 'suspended' && $service->projet_id) {
            $project = \App\Models\Projet::find($service->projet_id);
            if ($project && !in_array($project->status, ['on_hold', 'cancelled'])) {
                $project->update(['status' => 'on_hold']);
                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'status_change',
                    'title' => 'Projet mis en pause - service suspendu',
                    'description' => "Le service {$service->name} a été suspendu manuellement. Le projet est mis en pause.",
                ]);
            }
            return redirect()->back()->with('success', 'Service suspendu. Le projet a été mis en pause.');
        }

        if ($validated['status'] === 'active' && $service->projet_id) {
            $project = \App\Models\Projet::find($service->projet_id);
            if ($project && $project->status === 'on_hold') {
                $project->update(['status' => 'completed']);
                $project->timelineEvents()->create([
                    'user_id' => auth()->id(),
                    'event_type' => 'status_change',
                    'title' => 'Projet réactivé - service réactivé',
                    'description' => "Le service {$service->name} a été réactivé. Le projet est remis en ligne.",
                ]);
            }
            return redirect()->back()->with('success', 'Service réactivé. Le projet est remis en ligne.');
        }

        return redirect()->back()->with('success', 'Statut du service mis à jour.');
    }
}
