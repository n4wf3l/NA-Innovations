<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClientController extends BaseAdminController
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'client')->withCount(['projects', 'invoices']);

        // Search by name, email, or company
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        $clients = $query->latest()->paginate(15)->withQueryString();

        $totalClients = User::where('role', 'client')->count();
        $activeClients = User::where('role', 'client')->whereHas('projects', function ($q) {
            $q->whereIn('status', ['in_progress', 'review']);
        })->count();
        $totalRevenue = \App\Models\Invoice::where('status', 'paid')->sum('total');

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
            'totalClients' => $totalClients,
            'activeClients' => $activeClients,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    /**
     * Show the form for creating a new client.
     */
    public function create()
    {
        return Inertia::render('Admin/Clients/Create');
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'vat_number' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'financial_pin' => 'nullable|string|min:4|max:6',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ]);

        $financialPin = $validated['financial_pin'] ?? null;
        unset($validated['financial_pin']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['avatar'] = $request->file('logo')->store('logos', 'public');
        }
        unset($validated['logo']);

        $validated['role'] = 'client';
        $validated['password'] = Hash::make(Str::random(32));
        $validated['is_active'] = true;
        $validated['approved_at'] = now();

        $user = User::create($validated);

        // Set financial PIN if provided
        if ($financialPin) {
            $user->update(['financial_pin' => Hash::make($financialPin)]);
        }

        // Send welcome email
        NotificationService::send($user, 'client-welcome', [
            'client_name' => $user->name,
            'email' => $user->email,
            'portal_url' => url('/login'),
        ], transactional: true);

        // Send password reset link so client can set their own password
        try {
            Password::sendResetLink(['email' => $user->email]);
        } catch (\Exception $e) {
            // Don't fail if mail not configured
        }

        return redirect()->route('admin.clients.index')->with('success', 'Client created. A welcome email with password setup link has been sent.');
    }

    /**
     * Display the specified client.
     */
    public function show($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        $client->load([
            'projects',
            'quotes',
            'invoices',
            'recurringServices',
        ]);

        return Inertia::render('Admin/Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified client.
     */
    public function edit($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        return Inertia::render('Admin/Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, $id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $client->id,
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'vat_number' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'financial_pin' => 'nullable|string|min:4|max:6',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ]);

        // Update financial PIN if provided
        if ($request->filled('financial_pin')) {
            $client->update(['financial_pin' => Hash::make($validated['financial_pin'])]);
        }
        unset($validated['financial_pin']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($client->avatar) {
                Storage::disk('public')->delete($client->avatar);
            }
            $validated['avatar'] = $request->file('logo')->store('logos', 'public');
        }
        unset($validated['logo']);

        $client->update($validated);

        return redirect()->route('admin.clients.index')->with('success', 'Client updated successfully.');
    }

    /**
     * Soft delete the specified client.
     */
    public function destroy($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);
        $client->delete();

        return redirect()->route('admin.clients.index')->with('success', 'Client deleted successfully.');
    }
}
