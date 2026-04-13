<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ __('pdf.annual_billing_summary') }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 11px; color: #111827; line-height: 1.5; background: #fff; }
        .page { padding: 40px 50px; }
        h1 { font-size: 22px; color: #111827; margin-bottom: 4px; }
        h2 { font-size: 14px; color: #111827; margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #5eead4; padding-bottom: 4px; }
        .subtitle { font-size: 12px; color: #6b7280; margin-bottom: 20px; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 25px; }
        .info-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 15px 18px; margin-bottom: 20px; }
        .info-block table td { padding: 3px 10px 3px 0; font-size: 11px; }
        .info-block table td:first-child { font-weight: bold; color: #6b7280; width: 160px; }
        table.main { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.main thead th { background-color: #111827; color: #fff; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        table.main thead th.text-right { text-align: right; }
        table.main tbody td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #e5e7eb; }
        table.main tbody td.text-right { text-align: right; }
        .quarter-header td { background: #f3f4f6; font-weight: bold; font-size: 11px; padding: 8px 10px; }
        .subtotal-row td { background: #f0fdfa; font-weight: 600; border-top: 1px solid #5eead4; }
        .grand-total td { background: #111827; color: #fff; font-weight: bold; font-size: 12px; padding: 8px 10px; }
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
        .status-paid { background: #d1fae5; color: #047857; }
        .status-sent, .status-overdue { background: #fee2e2; color: #b91c1c; }
        .status-draft { background: #f3f4f6; color: #6b7280; }
        .summary-grid { width: 100%; margin-bottom: 20px; }
        .summary-grid td { width: 33%; text-align: center; padding: 8px; }
        .summary-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 10px; }
        .summary-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 3px; }
        .summary-value { font-size: 16px; font-weight: bold; color: #111827; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 10px; text-align: center; font-size: 8px; color: #9ca3af; position: fixed; bottom: 30px; left: 50px; right: 50px; }
    </style>
</head>
<body>
    <div class="page">
        <h1>{{ __('pdf.annual_billing_summary') }}</h1>
        <div class="subtitle">{{ $client->name }} — {{ $year }}</div>
        <div class="accent-line"></div>

        <div class="info-block">
            <table>
                <tr><td>{{ __('pdf.client') }}</td><td>{{ $client->name }}</td></tr>
                @if($client->company_name)<tr><td>{{ __('pdf.company') }}</td><td>{{ $client->company_name }}</td></tr>@endif
                <tr><td>{{ __('pdf.email') }}</td><td>{{ $client->email }}</td></tr>
                <tr><td>{{ __('pdf.year') }}</td><td>{{ $year }}</td></tr>
            </table>
        </div>

        {{-- Summary --}}
        <table class="summary-grid">
            <tr>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.total_invoiced') }}</div>
                        <div class="summary-value">&euro; {{ number_format($totalInvoiced, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.total_paid') }}</div>
                        <div class="summary-value" style="color: #059669;">&euro; {{ number_format($totalPaid, 2, ',', '.') }}</div>
                    </div>
                </td>
                <td>
                    <div class="summary-box">
                        <div class="summary-label">{{ __('pdf.outstanding') }}</div>
                        <div class="summary-value" style="color: #dc2626;">&euro; {{ number_format($totalOutstanding, 2, ',', '.') }}</div>
                    </div>
                </td>
            </tr>
        </table>

        {{-- Invoices by Quarter --}}
        @foreach($quarters as $qLabel => $qInvoices)
            @if($qInvoices->count() > 0)
            <table class="main">
                <thead>
                    <tr>
                        <th>{{ __('pdf.invoice_number') }}</th>
                        <th>{{ __('pdf.issue_date') }}</th>
                        <th>{{ __('pdf.type') }}</th>
                        <th class="text-right">{{ __('pdf.total') }}</th>
                        <th class="text-right">{{ __('pdf.paid') }}</th>
                        <th>{{ __('pdf.status') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="quarter-header"><td colspan="6">{{ $qLabel }}</td></tr>
                    @foreach($qInvoices as $inv)
                        <tr>
                            <td>{{ $inv->invoice_number }}</td>
                            <td>{{ $inv->issue_date?->format('d/m/Y') }}</td>
                            <td>{{ $inv->type ?? 'standard' }}</td>
                            <td class="text-right">&euro; {{ number_format($inv->total, 2, ',', '.') }}</td>
                            <td class="text-right">&euro; {{ number_format($inv->amount_paid, 2, ',', '.') }}</td>
                            <td><span class="status-badge status-{{ $inv->status }}">{{ $inv->status }}</span></td>
                        </tr>
                    @endforeach
                    <tr class="subtotal-row">
                        <td colspan="3" style="text-align: right;">{{ __('pdf.subtotal') }} {{ $qLabel }}</td>
                        <td class="text-right">&euro; {{ number_format($qInvoices->sum('total'), 2, ',', '.') }}</td>
                        <td class="text-right">&euro; {{ number_format($qInvoices->sum('amount_paid'), 2, ',', '.') }}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            @endif
        @endforeach

        <table class="main">
            <tbody>
                <tr class="grand-total">
                    <td colspan="3" style="text-align: right;">{{ __('pdf.grand_total') }} {{ $year }}</td>
                    <td class="text-right">&euro; {{ number_format($totalInvoiced, 2, ',', '.') }}</td>
                    <td class="text-right">&euro; {{ number_format($totalPaid, 2, ',', '.') }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            {{ __('pdf.generated_on') }} {{ now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
