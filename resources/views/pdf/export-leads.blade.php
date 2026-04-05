<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Export Leads</title>
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

        /* Status badges */
        .status { padding: 2px 6px; border-radius: 4px; font-size: 7pt; font-weight: bold; text-transform: uppercase; }
        .status-new { background: #ede9fe; color: #5b21b6; }
        .status-contacted { background: #dbeafe; color: #1e40af; }
        .status-qualified { background: #cffafe; color: #0e7490; }
        .status-quote_sent { background: #fef3c7; color: #92400e; }
        .status-won { background: #d1fae5; color: #065f46; }
        .status-lost { background: #fee2e2; color: #991b1b; }

        /* Stats box */
        .stats { margin-top: 15px; margin-bottom: 10px; }
        .stats table { width: auto; border-collapse: collapse; }
        .stats td { padding: 4px 12px; font-size: 9pt; }
        .stats td.label { font-weight: bold; color: #374151; }
        .stats td.value { color: #111827; }

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
                    <td><img src="{{ public_path('dark-logo.png') }}" style="height: 35px; width: auto; margin-bottom: 4px;"><br><div class="company-name">NA Innovations</div></td>
                    <td>
                        <div class="report-title">Export Leads</div>
                        <div class="report-subtitle">
                            @if(($filters['from'] ?? null) || ($filters['to'] ?? null))
                                {{ $filters['from'] ?? '...' }} &mdash; {{ $filters['to'] ?? '...' }}
                            @else
                                Tous les leads
                            @endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Filters -->
        @if(($filters['status'] ?? null) || ($filters['source'] ?? null) || ($filters['from'] ?? null) || ($filters['to'] ?? null))
        <div class="filters">
            Filtres actifs :
            @if($filters['status'] ?? null) <span>Statut : {{ ucfirst($filters['status']) }}</span> @endif
            @if($filters['source'] ?? null) <span>Source : {{ ucfirst($filters['source']) }}</span> @endif
            @if($filters['from'] ?? null) <span>Du : {{ $filters['from'] }}</span> @endif
            @if($filters['to'] ?? null) <span>Au : {{ $filters['to'] }}</span> @endif
        </div>
        @endif

        <!-- Data table -->
        <table class="data">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Source</th>
                    <th>Statut</th>
                    <th class="right">Budget estimé</th>
                    <th>Partenaire</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($leads as $lead)
                <tr>
                    <td>{{ $lead->first_name }} {{ $lead->last_name }}</td>
                    <td>{{ $lead->email }}</td>
                    <td>{{ $lead->company_name ?? '—' }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $lead->source)) }}</td>
                    <td>
                        <span class="status status-{{ $lead->status }}">{{ ucfirst(str_replace('_', ' ', $lead->status)) }}</span>
                    </td>
                    <td class="right">
                        @if($lead->estimated_budget)
                            &euro; {{ number_format($lead->estimated_budget, 2, ',', '.') }}
                        @else
                            —
                        @endif
                    </td>
                    <td>{{ $lead->referralPartner?->user?->name ?? '—' }}</td>
                    <td>{{ $lead->created_at?->format('d/m/Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Stats -->
        <div class="stats">
            <table>
                <tr>
                    <td class="label">Total leads :</td>
                    <td class="value">{{ $stats['total'] }}</td>
                    <td class="label">Gagnés :</td>
                    <td class="value">{{ $stats['won'] }}</td>
                    <td class="label">Perdus :</td>
                    <td class="value">{{ $stats['lost'] }}</td>
                    <td class="label">Taux de conversion :</td>
                    <td class="value">{{ $stats['conversion_rate'] }}%</td>
                </tr>
            </table>
        </div>

        <div style="font-size: 8pt; color: #6b7280; margin-top: 10px;">
            {{ $leads->count() }} lead(s) exporté(s)
        </div>

        <!-- Footer -->
        <div class="footer">
            Généré le {{ $generated_at->format('d/m/Y à H:i') }} par NA Innovations Platform
        </div>
    </div>
</body>
</html>
