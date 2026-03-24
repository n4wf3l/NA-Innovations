<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
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

        return view('admin.clients.index', compact('clients'));
    }

    /**
     * Show the form for creating a new client.
     */
    public function create()
    {
        return view('admin.clients.create');
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
        ]);

        $validated['role'] = 'client';
        $validated['password'] = Hash::make(Str::random(16));

        User::create($validated);

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

        return view('admin.clients.show', compact('client'));
    }

    /**
     * Show the form for editing the specified client.
     */
    public function edit($id)
    {
        $client = User::where('role', 'client')->findOrFail($id);

        return view('admin.clients.edit', compact('client'));
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
        ]);

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
