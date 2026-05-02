<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ __('pdf.commission_statement') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 11px; color: #111827; line-height: 1.5; background: #fff; }
        .page { padding: 40px 50px; }
        h1 { font-size: 22px; color: #111827; margin-bottom: 4px; }
        .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 25px; }
        .info-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 15px 18px; margin-bottom: 20px; }
        .info-block table td { padding: 3px 10px 3px 0; font-size: 11px; }
        .info-block table td:first-child { font-weight: bold; color: #6b7280; width: 160px; }
        table.main { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.main thead th { background-color: #111827; color: #fff; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        table.main thead th.text-right { text-align: right; }
        table.main tbody td { padding: 8px 10px; font-size: 10px; border-bottom: 1px solid #e5e7eb; }
        table.main tbody td.text-right { text-align: right; }
        table.main tbody tr:last-child td { border-bottom: none; }
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
        .status-estimated { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1d4ed8; }
        .status-scheduled { background: #e0e7ff; color: #4338ca; }
        .status-paid { background: #d1fae5; color: #047857; }
        .summary-grid { width: 100%; margin-bottom: 20px; }
        .summary-grid td { width: 25%; text-align: center; padding: 8px; }
        .summary-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 10px; }
        .summary-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 3px; }
        .summary-value { font-size: 16px; font-weight: bold; color: #111827; }
        .total-row td { background: #f0fdfa; font-weight: bold; border-top: 2px solid #5eead4; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; text-align: center; font-size: 8px; color: #9ca3af; position: fixed; bottom: 30px; left: 50px; right: 50px; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ __('pdf.commission_statement') }}</h1>
        <div class="subtitle">{{ $partner->user->name ?? '' }}</div>
        <div class="accent-line"></div>

        <div class="info-block">
            <table>
                <tr><td>{{ __('pdf.partner') }}</td><td>{{ $partner->user->name ?? '' }}</td></tr>
                <tr><td>{{ __('pdf.email') }}</td><td>{{ $partner->user->email ?? '' }}</td></tr>
                <tr><td>{{ __('pdf.referral_code') }}</td><td>{{ $partner->referral_code ?? '' }}</td></tr>
                <tr><td>{{ __('pdf.commission_rate_default') }}</td><td>{{ $partner->default_commission_rate ?? 0 }}%</td></tr>
            </table>
        </div>

        {{-- Summary by Status --}}
        <table class="summary-grid">
            <tr>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.estimated') }}</div>
                        <div class="summary-value">&euro; {{ number_format($totalEstimated, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.confirmed') }}</div>
                        <div class="summary-value">&euro; {{ number_format($totalConfirmed, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.scheduled') }}</div>
                        <div class="summary-value">&euro; {{ number_format($totalScheduled, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.paid_commissions') }}</div>
                        <div class="summary-value" style="color: #059669;">&euro; {{ number_format($totalPaidCommissions, 2, ',', '.') }}</div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Detail Table --}}
        <table class="main">
            <thead>
                <tr>
                    <th>{{ __('pdf.date_col') }}</th>
                    <th>{{ __('pdf.invoice') }}</th>
                    <th class="text-right">{{ __('pdf.base_amount') }}</th>
                    <th class="text-right">{{ __('pdf.rate') }}</th>
                    <th class="text-right">{{ __('pdf.commission') }}</th>
                    <th>{{ __('pdf.status') }}</th>
                </tr>
            </thead>
            <tbody>
                @foreach($commissions as $c)
                    <tr>
                        <td>{{ $c->created_at->format('d/m/Y') }}</td>
                        <td>{{ $c->invoice?->invoice_number ?? '-' }}</td>
                        <td class="text-right">&euro; {{ number_format($c->base_amount, 2, ',', '.') }}</td>
                        <td class="text-right">{{ $c->commission_rate }}%</td>
                        <td class="text-right">&euro; {{ number_format($c->commission_amount, 2, ',', '.') }}</td>
                        <td>
                            <span class="status-badge status-{{ $c->status }}">{{ $c->status }}</span>
                        </td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="4" style="text-align: right;">{{ __('pdf.total') }}</td>
                    <td class="text-right">&euro; {{ number_format($commissions->sum('commission_amount'), 2, ',', '.') }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }} - {{ __('pdf.confidential_document') }}
        </div>
    </div>
</body>
</html>
