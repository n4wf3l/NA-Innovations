<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ProjectType;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommissionRateController extends BaseAdminController
{
    public function index()
    {
        return Inertia::render('Admin/Settings/CommissionRates', [
            'rates' => ProjectType::allWithRates(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'rates' => 'required|array',
            'rates.*.type' => 'required|string',
            'rates.*.rate' => 'required|numeric|min:0|max:100',
        ]);

        foreach ($validated['rates'] as $item) {
            Setting::set("commission.rate.{$item['type']}", (string) $item['rate']);
        }

        return redirect()->back()->with('success', 'Taux de commission mis à jour.');
    }
}
