<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialSimulation extends Model
{
    protected $fillable = [
        'name', 'product_id', 'product_name', 'monthly_price',
        'client_growth', 'team_members', 'infra_cost_monthly', 'infra_items',
        'initial_investment', 'price_tiers',
        'commission_rate', 'time_horizon', 'notes', 'shared_with_devs', 'history',
    ];

    protected $casts = [
        'client_growth' => 'array',
        'team_members' => 'array',
        'infra_items' => 'array',
        'price_tiers' => 'array',
        'shared_with_devs' => 'array',
        'history' => 'array',
        'monthly_price' => 'decimal:2',
        'infra_cost_monthly' => 'decimal:2',
        'initial_investment' => 'decimal:2',
        'commission_rate' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Compute month-by-month projection.
     */
    public function computeProjection(): array
    {
        $months = [];
        $cumulative = -($this->initial_investment ?? 0); // Start negative if initial investment
        $teamCost = collect($this->team_members)->sum('monthly_salary');
        $breakEven = null;
        $tiers = collect($this->price_tiers ?? [])->sortBy('from_month')->values();

        for ($i = 0; $i < $this->time_horizon; $i++) {
            $monthNum = $i + 1;
            $growth = $this->client_growth;

            if (isset($growth['initial_clients'])) {
                $clients = round($growth['initial_clients'] * pow(1 + ($growth['monthly_growth_rate'] ?? 0) / 100, $i));
            } else {
                $clients = $growth[$i] ?? ($growth[count($growth) - 1] ?? 0);
            }

            // Price tiers: find the applicable price for this month
            $price = $this->monthly_price;
            foreach ($tiers as $tier) {
                if ($monthNum >= ($tier['from_month'] ?? 1)) {
                    $price = $tier['price'];
                }
            }

            $revenue = $clients * $price;
            $commissionCost = $revenue * $this->commission_rate / 100;
            $totalCost = $teamCost + $this->infra_cost_monthly + $commissionCost;
            $profit = $revenue - $totalCost;
            $cumulative += $profit;

            if ($breakEven === null && $cumulative > 0) {
                $breakEven = $monthNum;
            }

            $months[] = [
                'month' => $monthNum,
                'clients' => (int) $clients,
                'price' => round($price, 2),
                'revenue' => round($revenue, 2),
                'total_cost' => round($totalCost, 2),
                'profit' => round($profit, 2),
                'cumulative' => round($cumulative, 2),
            ];
        }

        return [
            'months' => $months,
            'break_even_month' => $breakEven,
            'initial_investment' => round($this->initial_investment ?? 0, 2),
            'total_revenue' => round(collect($months)->sum('revenue'), 2),
            'total_costs' => round(collect($months)->sum('total_cost') + ($this->initial_investment ?? 0), 2),
            'total_profit' => round($cumulative, 2),
        ];
    }
}
