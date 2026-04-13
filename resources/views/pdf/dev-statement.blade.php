<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ __('pdf.earning_statement') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 11px; color: #111827; line-height: 1.5; background: #fff; }
        .page { padding: 40px 50px; }
        h1 { font-size: 22px; color: #111827; margin-bottom: 4px; }
        .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 25px; }
        .info-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 15px 18px; margin-bottom: 20px; }
        .info-block td { padding: 3px 10px 3px 0; font-size: 11px; }
        .info-block td:first-child { font-weight: bold; color: #6b7280; width: 160px; }
        table.main { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.main thead th { background-color: #111827; color: #fff; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        table.main thead th.text-right { text-align: right; }
        table.main tbody td { padding: 8px 10px; font-size: 11px; border-bottom: 1px solid #e5e7eb; }
        table.main tbody td.text-right { text-align: right; }
        .total-box { background: #f0fdfa; border: 2px solid #5eead4; border-radius: 4px; padding: 15px; text-align: center; margin-bottom: 20px; }
        .total-box .label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .total-box .amount { font-size: 28px; font-weight: bold; color: #111827; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; text-align: center; font-size: 8px; color: #9ca3af; position: fixed; bottom: 30px; left: 50px; right: 50px; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ __('pdf.earning_statement') }}</h1>
        <div class="subtitle">{{ $developer->name }} — {{ $monthLabel }}</div>
        <div class="accent-line"></div>

        <div class="info-block">
            <table>
                <tr><td>{{ __('pdf.developer') }}</td><td>{{ $developer->name }}</td></tr>
                <tr><td>{{ __('pdf.email') }}</td><td>{{ $developer->email }}</td></tr>
                <tr><td>{{ __('pdf.period') }}</td><td>{{ $monthLabel }}</td></tr>
                <tr><td>{{ __('pdf.hourly_rate') }}</td><td>&euro; {{ number_format($hourlyRate, 2, ',', '.') }}</td></tr>
            </table>
        </div>

        <table class="main">
            <thead>
                <tr>
                    <th>{{ __('pdf.status') }}</th>
                    <th class="text-right">{{ __('pdf.hours') }}</th>
                    <th class="text-right">{{ __('pdf.amount') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ __('pdf.approved_billable') }}</td>
                    <td class="text-right">{{ number_format($approvedHours, 2) }}h</td>
                    <td class="text-right">&euro; {{ number_format($approvedAmount, 2, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>{{ __('pdf.pending_approval') }}</td>
                    <td class="text-right">{{ number_format($pendingHours, 2) }}h</td>
                    <td class="text-right">&euro; {{ number_format($pendingAmount, 2, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>{{ __('pdf.non_billable') }}</td>
                    <td class="text-right">{{ number_format($nonBillableHours, 2) }}h</td>
                    <td class="text-right">—</td>
                </tr>
            </tbody>
        </table>

        <div class="total-box">
            <div class="label">{{ __('pdf.total_earned_month') }}</div>
            <div class="amount">&euro; {{ number_format($approvedAmount, 2, ',', '.') }}</div>
        </div>

        <div class="footer">
            {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }} — {{ __('pdf.confidential_document') }}
        </div>
    </div>
</body>
</html>
