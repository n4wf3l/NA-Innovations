<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Feuille de temps</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 11px; color: #111827; line-height: 1.5; background: #fff; }
        .page { padding: 40px 50px; }
        h1 { font-size: 22px; color: #111827; margin-bottom: 4px; }
        .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 25px; }
        .summary-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px 16px; margin-bottom: 20px; font-size: 11px; }
        .summary-box strong { color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        thead th { background-color: #111827; color: #fff; padding: 6px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        thead th.text-right { text-align: right; }
        thead th.text-center { text-align: center; }
        tbody td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #e5e7eb; }
        tbody td.text-right { text-align: right; }
        tbody td.text-center { text-align: center; }
        .project-header td { background: #f3f4f6; font-weight: bold; font-size: 11px; padding: 8px 10px; }
        .subtotal-row td { background: #f0fdfa; font-weight: 600; border-top: 1px solid #5eead4; }
        .grand-total td { background: #111827; color: #fff; font-weight: bold; font-size: 12px; padding: 8px 10px; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; text-align: center; font-size: 8px; color: #9ca3af; position: fixed; bottom: 30px; left: 50px; right: 50px; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ __('pdf.timesheet') }}</h1>
        <div class="subtitle">{{ $developer->name }} - {{ $from->format('d/m/Y') }} {{ __('pdf.to') }} {{ $to->format('d/m/Y') }}</div>
        <div class="accent-line"></div>

        <div class="summary-box">
            <strong>{{ __('pdf.total_hours') }}:</strong> {{ number_format($totalHours, 2) }}h
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <strong>{{ __('pdf.billable_hours') }}:</strong> {{ number_format($billableHours, 2) }}h
            @if($hourlyRate > 0)
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <strong>{{ __('pdf.total_amount') }}:</strong> &euro; {{ number_format($totalAmount, 2, ',', '.') }}
            @endif
        </div>

        @foreach($groupedEntries as $projectName => $entries)
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px;">{{ __('pdf.date_col') }}</th>
                        <th>{{ __('pdf.description') }}</th>
                        <th class="text-center" style="width: 70px;">{{ __('pdf.category') }}</th>
                        <th class="text-center" style="width: 50px;">{{ __('pdf.billable') }}</th>
                        <th class="text-right" style="width: 60px;">{{ __('pdf.hours') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="project-header">
                        <td colspan="5">{{ $projectName }}</td>
                    </tr>
                    @foreach($entries as $entry)
                        <tr>
                            <td>{{ $entry->date->format('d/m/Y') }}</td>
                            <td>{{ $entry->description }}</td>
                            <td class="text-center">{{ $entry->task_category ?? '-' }}</td>
                            <td class="text-center">{{ $entry->is_billable ? '✓' : '-' }}</td>
                            <td class="text-right">{{ number_format($entry->hours, 2) }}h</td>
                        </tr>
                    @endforeach
                    <tr class="subtotal-row">
                        <td colspan="4" style="text-align: right;">{{ __('pdf.subtotal') }}</td>
                        <td class="text-right">{{ number_format($entries->sum('hours'), 2) }}h</td>
                    </tr>
                </tbody>
            </table>
        @endforeach

        <table>
            <tbody>
                <tr class="grand-total">
                    <td colspan="4" style="text-align: right;">{{ __('pdf.grand_total') }}</td>
                    <td class="text-right" style="width: 60px;">{{ number_format($totalHours, 2) }}h</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
