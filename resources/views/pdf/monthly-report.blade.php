<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ __('pdf.monthly_financial_report') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 11px; color: #111827; line-height: 1.5; background: #fff; }
        .page { padding: 30px 40px; }
        h1 { font-size: 22px; color: #111827; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #111827; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #5eead4; padding-bottom: 4px; }
        .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 15px; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 20px; }
        .kpi-grid { width: 100%; margin-bottom: 20px; }
        .kpi-grid td { width: 25%; text-align: center; padding: 10px; }
        .kpi-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; }
        .kpi-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 4px; }
        .kpi-value { font-size: 18px; font-weight: bold; color: #111827; }
        .kpi-value.green { color: #059669; }
        .kpi-value.red { color: #dc2626; }
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.data thead th { background-color: #111827; color: #fff; padding: 6px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        table.data thead th.text-right { text-align: right; }
        table.data tbody td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #e5e7eb; }
        table.data tbody td.text-right { text-align: right; }
        table.data tbody tr.total td { background: #f0fdfa; font-weight: bold; border-top: 2px solid #5eead4; }
        .pl-table { width: 60%; margin: 0 auto 20px; }
        .pl-table td { padding: 6px 12px; font-size: 11px; border-bottom: 1px solid #e5e7eb; }
        .pl-table td:first-child { font-weight: 600; }
        .pl-table td:last-child { text-align: right; }
        .pl-table tr.total td { font-size: 14px; font-weight: bold; border-top: 2px solid #5eead4; padding-top: 8px; }
        .pl-table tr.total td.positive { color: #059669; }
        .pl-table tr.total td.negative { color: #dc2626; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; text-align: center; font-size: 8px; color: #9ca3af; position: fixed; bottom: 20px; left: 40px; right: 40px; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ __('pdf.monthly_financial_report') }}</h1>
        <div class="subtitle">{{ $monthLabel }} — {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }}</div>
        <div class="accent-line"></div>

        {{-- KPI Cards --}}
        <table class="kpi-grid">
            <tr>
                <td>
                    <div class="kpi-box">
                        <div class="kpi-label">{{ __('pdf.total_invoiced') }}</div>
                        <div class="kpi-value">&euro; {{ number_format($totalInvoiced, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="kpi-box">
                        <div class="kpi-label">{{ __('pdf.total_paid') }}</div>
                        <div class="kpi-value green">&euro; {{ number_format($totalPaid, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="kpi-box">
                        <div class="kpi-label">{{ __('pdf.outstanding') }}</div>
                        <div class="kpi-value red">&euro; {{ number_format($totalOutstanding, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="kpi-box">
                        <div class="kpi-label">{{ __('pdf.new_leads') }}</div>
                        <div class="kpi-value">{{ $newLeads }}</div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Lead Funnel --}}
        <h2>{{ __('pdf.lead_funnel') }}</h2>
        <table class="data">
            <thead>
                <tr>
                    <th>{{ __('pdf.metric') }}</th>
                    <th class="text-right">{{ __('pdf.count') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>{{ __('pdf.new_leads') }}</td><td class="text-right">{{ $newLeads }}</td></tr>
                <tr><td>{{ __('pdf.won_leads') }}</td><td class="text-right">{{ $wonLeads }}</td></tr>
                <tr><td>{{ __('pdf.lost_leads') }}</td><td class="text-right">{{ $lostLeads }}</td></tr>
                <tr><td>{{ __('pdf.conversion_rate') }}</td><td class="text-right">{{ $conversionRate }}%</td></tr>
            </tbody>
        </table>

        {{-- Revenue by Service --}}
        @if(count($revenueByService) > 0)
        <h2>{{ __('pdf.revenue_by_service') }}</h2>
        <table class="data">
            <thead>
                <tr>
                    <th>{{ __('pdf.service_type') }}</th>
                    <th class="text-right">{{ __('pdf.amount') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($revenueByService as $service => $amount)
                    <tr>
                        <td>{{ $service }}</td>
                        <td class="text-right">&euro; {{ number_format($amount, 2, ',', '.') }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        {{-- P&L --}}
        <h2>{{ __('pdf.simple_pl') }}</h2>
        <table class="pl-table">
            <tr><td>{{ __('pdf.revenue') }}</td><td>&euro; {{ number_format($totalPaid, 2, ',', '.') }}</td></tr>
            <tr><td>{{ __('pdf.commissions') }}</td><td>- &euro; {{ number_format($totalCommissions, 2, ',', '.') }}</td></tr>
            @php $profit = $totalPaid - $totalCommissions; @endphp
            <tr class="total">
                <td>{{ __('pdf.net_result') }}</td>
                <td class="{{ $profit >= 0 ? 'positive' : 'negative' }}">&euro; {{ number_format($profit, 2, ',', '.') }}</td>
            </tr>
        </table>

        <div class="footer">
            {{ __('pdf.confidential_document') }} — {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
