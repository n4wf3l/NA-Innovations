<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
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
        ]);

        $financialPin = $validated['financial_pin'] ?? null;
        unset($validated['financial_pin']);

        $validated['role'] = 'client';
        $validated['password'] = Hash::make(Str::random(16));

        $user = User::create($validated);

        // Set financial PIN if provided
        if ($financialPin) {
            $user->update(['financial_pin' => Hash::make($financialPin)]);
        }

        return redirect()->route('admin.clients.index')->with('success', 'Client created successfully.');
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
        ]);

        // Update financial PIN if provided
        if ($request->filled('financial_pin')) {
            $client->update(['financial_pin' => Hash::make($validated['financial_pin'])]);
        }
        unset($validated['financial_pin']);

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
