<?php

namespace App\Http\Controllers\Dev;

use App\Models\Setting;
use App\Models\TimeEntry;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class EarningsController extends Controller
{
    public function index()
    {
        if (Setting::get('dev.show_earnings', '1') !== '1') {
            return redirect()->route('dev.dashboard')->with('error', __('Section non disponible.'));
        }

        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) abort(403);

        $rate = (float) ($user->hourly_rate ?? 0);

        $months = [];
        $totalYtd = 0;
        for ($i = 11; $i >= 0; $i--) {
            $s = now()->subMonths($i)->startOfMonth();
            $e = now()->subMonths($i)->endOfMonth();
            $hours = TimeEntry::where('user_id', $user->id)
                ->where('approval_status', 'approved')
                ->where('is_billable', true)
                ->whereBetween('date', [$s, $e])
                ->sum('hours');
            $loggedHours = TimeEntry::where('user_id', $user->id)
                ->whereBetween('date', [$s, $e])
                ->sum('hours');
            $amount = round($hours * $rate, 2);
            if ($s->year === now()->year) {
                $totalYtd += $amount;
            }
            $months[] = [
                'month' => $s->format('M Y'),
                'hours' => round((float) $hours, 2),
                'logged' => round((float) $loggedHours, 2),
                'amount' => $amount,
            ];
        }

        $pending = TimeEntry::where('user_id', $user->id)
            ->where('approval_status', 'pending')
            ->orderByDesc('date')
            ->with('project')
            ->get();

        return Inertia::render('Dev/Earnings', [
            'months' => $months,
            'totalYtd' => round($totalYtd, 2),
            'hourlyRate' => $rate,
            'pendingEntries' => $pending,
        ]);
    }
}
