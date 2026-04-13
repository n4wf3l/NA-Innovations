<?php

namespace App\Http\Controllers\Dev;

use App\Models\Setting;
use App\Models\TimeEntry;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ExportController extends Controller
{
    /**
     * Générer une feuille de temps PDF pour une période.
     */
    public function timesheetPdf(Request $request)
    {
        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) {
            abort(403);
        }

        $from = $request->filled('from')
            ? \Carbon\Carbon::parse($request->from)->startOfDay()
            : now()->startOfMonth();

        $to = $request->filled('to')
            ? \Carbon\Carbon::parse($request->to)->endOfDay()
            : now()->endOfMonth();

        $query = TimeEntry::where('user_id', $user->id)
            ->whereBetween('date', [$from, $to])
            ->with('project')
            ->orderBy('date');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        $entries = $query->get();
        $groupedEntries = $entries->groupBy(fn($e) => $e->project?->nom_societe ?? __('Sans projet'));

        $totalHours = $entries->sum('hours');
        $billableHours = $entries->where('is_billable', true)->sum('hours');
        $hourlyRate = (float) ($user->hourly_rate ?? 0);
        $totalAmount = round($billableHours * $hourlyRate, 2);

        $pdf = Pdf::loadView('pdf.dev-timesheet', [
            'developer' => $user,
            'from' => $from,
            'to' => $to,
            'groupedEntries' => $groupedEntries,
            'totalHours' => $totalHours,
            'billableHours' => $billableHours,
            'hourlyRate' => $hourlyRate,
            'totalAmount' => $totalAmount,
        ])->setPaper('a4');

        return $pdf->download('timesheet-' . $from->format('Y-m-d') . '-' . $to->format('Y-m-d') . '.pdf');
    }

    /**
     * Générer un relevé de revenus mensuel PDF.
     */
    public function monthlyStatement(Request $request)
    {
        if (Setting::get('dev.show_earnings', '1') !== '1') {
            return redirect()->route('dev.dashboard')->with('error', __('Section non disponible.'));
        }

        $user = auth()->user();
        if (!in_array($user->role, ['developer', 'admin'])) {
            abort(403);
        }

        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $start = \Carbon\Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $monthLabel = $start->translatedFormat('F Y');

        $hourlyRate = (float) ($user->hourly_rate ?? 0);

        $approvedHours = (float) TimeEntry::where('user_id', $user->id)
            ->where('approval_status', 'approved')
            ->where('is_billable', true)
            ->whereBetween('date', [$start, $end])
            ->sum('hours');

        $pendingHours = (float) TimeEntry::where('user_id', $user->id)
            ->where('approval_status', 'pending')
            ->where('is_billable', true)
            ->whereBetween('date', [$start, $end])
            ->sum('hours');

        $nonBillableHours = (float) TimeEntry::where('user_id', $user->id)
            ->where('is_billable', false)
            ->whereBetween('date', [$start, $end])
            ->sum('hours');

        $approvedAmount = round($approvedHours * $hourlyRate, 2);
        $pendingAmount = round($pendingHours * $hourlyRate, 2);

        $pdf = Pdf::loadView('pdf.dev-statement', [
            'developer' => $user,
            'monthLabel' => $monthLabel,
            'hourlyRate' => $hourlyRate,
            'approvedHours' => $approvedHours,
            'pendingHours' => $pendingHours,
            'nonBillableHours' => $nonBillableHours,
            'approvedAmount' => $approvedAmount,
            'pendingAmount' => $pendingAmount,
        ])->setPaper('a4');

        return $pdf->download('statement-' . $start->format('Y-m') . '.pdf');
    }
}
