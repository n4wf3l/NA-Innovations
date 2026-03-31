<?php

namespace App\Http\Controllers\Admin;

use App\Models\FinancialSimulation;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialSimulatorController extends BaseAdminController
{
    public function index()
    {
        $simulations = FinancialSimulation::with('product:id,name')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($sim) {
                $proj = $sim->computeProjection();
                return [
                    'id' => $sim->id,
                    'name' => $sim->name,
                    'product_name' => $sim->product_name ?: ($sim->product->name ?? null),
                    'monthly_price' => $sim->monthly_price,
                    'time_horizon' => $sim->time_horizon,
                    'team_member_count' => count($sim->team_members ?? []),
                    'updated_at' => $sim->updated_at?->toISOString(),
                    'total_projected_revenue' => $proj['total_revenue'],
                    'total_profit' => $proj['total_profit'],
                    'break_even_month' => $proj['break_even_month'],
                ];
            });

        return Inertia::render('Admin/Simulator/Index', [
            'simulations' => $simulations,
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'name', 'pricing_monthly')->orderBy('name')->get();

        return Inertia::render('Admin/Simulator/Show', [
            'simulation' => null,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateSimulation($request);
        $simulation = FinancialSimulation::create($validated);

        return redirect()->route('admin.simulator.show', $simulation)
            ->with('success', 'Simulation créée.');
    }

    public function show(FinancialSimulation $simulation)
    {
        $simulation->load('product:id,name,pricing_monthly');
        $products = Product::select('id', 'name', 'pricing_monthly')->orderBy('name')->get();
        $projection = $simulation->computeProjection();

        return Inertia::render('Admin/Simulator/Show', [
            'simulation' => $simulation,
            'products' => $products,
            'projection' => $projection,
        ]);
    }

    public function update(Request $request, FinancialSimulation $simulation)
    {
        $validated = $this->validateSimulation($request);

        // Track history
        $history = $simulation->history ?? [];
        $history[] = [
            'date' => now()->toISOString(),
            'user' => auth()->user()->name,
            'changes' => collect($validated)->filter(fn($v, $k) => $k !== 'history' && $simulation->getAttribute($k) != $v)->keys()->toArray(),
            'snapshot' => [
                'monthly_price' => $simulation->monthly_price,
                'time_horizon' => $simulation->time_horizon,
                'team_count' => count($simulation->team_members ?? []),
                'infra_cost' => $simulation->infra_cost_monthly,
            ],
        ];
        $validated['history'] = $history;

        $simulation->update($validated);

        return back()->with('success', 'Simulation mise à jour.');
    }

    public function destroy(FinancialSimulation $simulation)
    {
        $simulation->delete();
        return redirect()->route('admin.simulator.index')->with('success', 'Simulation supprimée.');
    }

    public function duplicate(FinancialSimulation $simulation)
    {
        $copy = $simulation->replicate();
        $copy->name = $simulation->name . ' (Copie)';
        $copy->save();

        return redirect()->route('admin.simulator.show', $copy)
            ->with('success', 'Simulation dupliquée.');
    }

    private function validateSimulation(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'product_name' => 'nullable|string|max:255',
            'monthly_price' => 'required|numeric|min:0',
            'client_growth' => 'required',
            'team_members' => 'required|array|min:1',
            'team_members.*.name' => 'required|string|max:255',
            'team_members.*.role' => 'nullable|string|max:100',
            'team_members.*.monthly_salary' => 'required|numeric|min:0',
            'infra_cost_monthly' => 'required|numeric|min:0',
            'infra_items' => 'nullable|array',
            'infra_items.*.name' => 'required|string|max:255',
            'infra_items.*.cost' => 'required|numeric|min:0',
            'infra_items.*.frequency' => 'nullable|string|in:monthly,yearly',
            'initial_investment' => 'nullable|numeric|min:0',
            'price_tiers' => 'nullable|array',
            'price_tiers.*.from_month' => 'required|integer|min:1',
            'price_tiers.*.price' => 'required|numeric|min:0',
            'price_tiers.*.label' => 'nullable|string|max:100',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'time_horizon' => 'required|integer|in:6,12,24,36',
            'notes' => 'nullable|string',
            'shared_with_devs' => 'nullable|array',
        ]);
    }
}
