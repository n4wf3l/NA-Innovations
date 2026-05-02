<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Payment Report</title>
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
        .status-completed { background: #d1fae5; color: #065f46; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-failed { background: #fee2e2; color: #991b1b; }

        /* Footer */
        .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 7pt; color: #9ca3af; text-align: center; }

        /* VAT summary box */
        .vat-summary { margin-top: 15px; padding: 10px 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; }
        .vat-summary h4 { font-size: 9pt; font-weight: bold; margin-bottom: 5px; color: #374151; }
        .vat-summary p { font-size: 8pt; color: #6b7280; }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <table>
                <tr>
                    <td><img src="{{ public_path('dark-logo.png') }}" style="height: 35px; width: auto; margin-bottom: 4px;"><br><div class="company-name">NA Innovations</div></td>
                    <td>
                        <div class="report-title">Payment Report</div>
                        <div class="report-subtitle">
                            @if($filters['from'] || $filters['to'])
                                {{ $filters['from'] ?? '...' }} &mdash; {{ $filters['to'] ?? '...' }}
                            @else
                                Tous les paiements
                            @endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Filters -->
        @if($filters['from'] || $filters['to'])
        <div class="filters">
            Filtres actifs :
            @if($filters['from']) <span>Du : {{ $filters['from'] }}</span> @endif
            @if($filters['to']) <span>Au : {{ $filters['to'] }}</span> @endif
        </div>
        @endif

        <!-- Data table -->
        <table class="data">
            <thead>
                <tr>
                    <th>Date de paiement</th>
                    <th>N° Facture</th>
                    <th>Client</th>
                    <th class="right">Montant</th>
                    <th>Méthode</th>
                    <th>Référence</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                @foreach($payments as $p)
                <tr>
                    <td>{{ $p->payment_date }}</td>
                    <td>{{ $p->invoice?->invoice_number ?? '-' }}</td>
                    <td>{{ $p->invoice?->client_name ?? '-' }}</td>
                    <td class="right">&euro; {{ number_format($p->amount, 2, ',', '.') }}</td>
                    <td>{{ ucfirst($p->method ?? '') }}</td>
                    <td>{{ $p->reference ?? '-' }}</td>
                    <td>
                        <span class="status status-{{ $p->status ?? 'completed' }}">{{ ucfirst($p->status ?? 'completed') }}</span>
                    </td>
                </tr>
                @endforeach

                <!-- Totals -->
                <tr class="totals">
                    <td colspan="3" style="text-align: right; font-weight: bold;">TOTAL</td>
                    <td class="right">&euro; {{ number_format($totals['total'], 2, ',', '.') }}</td>
                    <td colspan="3"></td>
                </tr>
            </tbody>
        </table>

        <!-- VAT summary -->
        <div class="vat-summary">
            <h4>Résumé pour déclaration TVA</h4>
            <p>Total des paiements reçus : <strong>&euro; {{ number_format($totals['total'], 2, ',', '.') }}</strong></p>
            <p>Période : {{ $filters['from'] ?? 'Début' }} - {{ $filters['to'] ?? 'Aujourd\'hui' }}</p>
            <p>Nombre de paiements : {{ $payments->count() }}</p>
        </div>

        <div style="font-size: 8pt; color: #6b7280; margin-top: 10px;">
            {{ $payments->count() }} paiement(s) exporté(s)
        </div>

        <!-- Footer -->
        <div class="footer">
            Généré le {{ $generated_at->format('d/m/Y à H:i') }} par NA Innovations Platform
        </div>
    </div>
</body>
</html>
