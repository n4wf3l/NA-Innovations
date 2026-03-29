<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Commission Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #111827; line-height: 1.4; background: #ffffff; }
        .page { padding: 30px 40px; }

        /* Header */
        .header { width: 100%; margin-bottom: 20px; border-bottom: 2px solid #111827; padding-bottom: 15px; }
        .header table { width: 100%; }
        .header td { vertical-align: top; }
        .company-name { font-size: 16px; font-weight: bold; color: #111827; }
        .report-title { font-size: 14px; font-weight: bold; color: #111827; text-align: right; }
        .report-subtitle { font-size: 9px; color: #6b7280; text-align: right; margin-top: 4px; }

        /* Filters info */
        .filters { margin-bottom: 15px; font-size: 8pt; color: #6b7280; }
        .filters span { font-weight: bold; color: #374151; }

        /* Table */
        table.data { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data th { background: #111827; color: #ffffff; padding: 6px 8px; text-align: left; font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        table.data th.right { text-align: right; }
        table.data td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 9pt; }
        table.data td.right { text-align: right; }
        table.data tr:nth-child(even) { background: #f9fafb; }
        table.data tr.totals { background: #f3f4f6; font-weight: bold; }
        table.data tr.totals td { border-top: 2px solid #111827; padding-top: 8px; }

        /* Status badges */
        .status { padding: 2px 6px; border-radius: 4px; font-size: 7pt; font-weight: bold; text-transform: uppercase; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dbeafe; color: #1e40af; }
        .status-scheduled { background: #e0e7ff; color: #3730a3; }
        .status-paid { background: #d1fae5; color: #065f46; }

        /* Footer */
        .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 7pt; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <table>
                <tr>
                    <td><div class="company-name">NA Innovations</div></td>
                    <td>
                        <div class="report-title">Commission Report</div>
                        <div class="report-subtitle">
                            @if($filters['from'] || $filters['to'])
                                {{ $filters['from'] ?? '...' }} &mdash; {{ $filters['to'] ?? '...' }}
                            @else
                                Toutes les commissions
                            @endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Filters -->
        @if($filters['status'] || $filters['from'] || $filters['to'])
        <div class="filters">
            Filtres actifs :
            @if($filters['status']) <span>Statut : {{ ucfirst($filters['status']) }}</span> @endif
            @if($filters['from']) <span>Du : {{ $filters['from'] }}</span> @endif
            @if($filters['to']) <span>Au : {{ $filters['to'] }}</span> @endif
        </div>
        @endif

        <!-- Data table -->
        <table class="data">
            <thead>
                <tr>
                    <th>Partenaire</th>
                    <th>Facture</th>
                    <th>Lead</th>
                    <th class="right">Taux (%)</th>
                    <th class="right">Montant de base</th>
                    <th class="right">Commission</th>
                    <th class="right">TVA</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                @foreach($commissions as $c)
                <tr>
                    <td>{{ $c->referralPartner?->user?->name ?? '—' }}</td>
                    <td>{{ $c->invoice?->invoice_number ?? '—' }}</td>
                    <td>{{ $c->lead ? $c->lead->first_name . ' ' . $c->lead->last_name : '—' }}</td>
                    <td class="right">{{ $c->commission_rate }}%</td>
                    <td class="right">&euro; {{ number_format($c->base_amount, 2, ',', '.') }}</td>
                    <td class="right">&euro; {{ number_format($c->commission_amount, 2, ',', '.') }}</td>
                    <td class="right">&euro; {{ number_format($c->tax_amount, 2, ',', '.') }}</td>
                    <td>
                        <span class="status status-{{ $c->status }}">{{ ucfirst($c->status) }}</span>
                    </td>
                </tr>
                @endforeach

                <!-- Totals -->
                <tr class="totals">
                    <td colspan="4" style="text-align: right; font-weight: bold;">TOTAUX</td>
                    <td class="right">&euro; {{ number_format($totals['base'], 2, ',', '.') }}</td>
                    <td class="right">&euro; {{ number_format($totals['commission'], 2, ',', '.') }}</td>
                    <td class="right">&euro; {{ number_format($totals['tax'], 2, ',', '.') }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div style="font-size: 8pt; color: #6b7280; margin-top: 10px;">
            {{ $commissions->count() }} commission(s) exportée(s)
        </div>

        <!-- Footer -->
        <div class="footer">
            Généré le {{ $generated_at->format('d/m/Y à H:i') }} par NA Innovations Platform
        </div>
    </div>
</body>
</html>
