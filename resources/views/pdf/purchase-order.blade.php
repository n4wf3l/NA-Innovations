<!DOCTYPE html>
<html lang="{{ $po->locale ?? 'fr' }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ __('pdf.purchase_order') }} {{ $po->po_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; font-size: 12px; color: #111827; line-height: 1.5; background: #ffffff; }
        .page { padding: 40px 50px; }
        .header { width: 100%; margin-bottom: 30px; }
        .header table { width: 100%; }
        .header td { vertical-align: top; }
        .company-name { font-size: 22px; font-weight: bold; color: #111827; margin-bottom: 4px; }
        .company-details { font-size: 10px; color: #6b7280; line-height: 1.6; }
        .po-title { font-size: 28px; font-weight: bold; color: #111827; text-align: right; letter-spacing: 2px; }
        .po-meta { text-align: right; font-size: 10px; color: #6b7280; margin-top: 8px; line-height: 1.8; }
        .po-meta strong { color: #111827; }
        .accent-line { height: 3px; background-color: #5eead4; margin-bottom: 25px; }
        .client-block { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; padding: 15px 18px; margin-bottom: 25px; }
        .client-block-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 6px; font-weight: bold; }
        .client-block .client-name { font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 2px; }
        .client-block .client-info { font-size: 10px; color: #6b7280; line-height: 1.6; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table thead th { background-color: #111827; color: #ffffff; padding: 8px 10px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; text-align: left; }
        .items-table thead th:first-child { border-radius: 4px 0 0 0; }
        .items-table thead th:last-child { border-radius: 0 4px 0 0; text-align: right; }
        .items-table thead th.text-right { text-align: right; }
        .items-table thead th.text-center { text-align: center; }
        .items-table tbody td { padding: 10px 10px; font-size: 11px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
        .items-table tbody td.text-right { text-align: right; }
        .items-table tbody td.text-center { text-align: center; }
        .items-table tbody tr:last-child td { border-bottom: none; }
        .item-details { font-size: 9px; color: #6b7280; margin-top: 2px; }
        .totals-wrapper { width: 100%; margin-bottom: 25px; }
        .totals-table { width: 280px; float: right; border-collapse: collapse; }
        .totals-table td { padding: 5px 10px; font-size: 11px; }
        .totals-table td:first-child { color: #6b7280; text-align: left; }
        .totals-table td:last-child { text-align: right; font-weight: 600; color: #111827; }
        .totals-table .total-row td { border-top: 2px solid #5eead4; padding-top: 8px; font-size: 14px; font-weight: bold; color: #111827; }
        .clearfix::after { content: ""; display: table; clear: both; }
        .quote-ref { background-color: #f0fdfa; border: 1px solid #5eead4; border-radius: 4px; padding: 10px 15px; font-size: 11px; color: #111827; margin-bottom: 25px; }
        .footer { border-top: 1px solid #e5e7eb; padding-top: 12px; text-align: center; font-size: 9px; color: #9ca3af; line-height: 1.6; position: fixed; bottom: 30px; left: 50px; right: 50px; }
    </style>
</head>
<body>
    <div class="page">
        {{-- Header --}}
        <div class="header">
            <table>
                <tr>
                    <td style="width: 55%;">
                        <img src="{{ public_path('dark-logo.png') }}" style="height: 40px; width: auto; margin-bottom: 8px;" alt="NA Innovations">
                        <div class="company-name">{{ $company['name'] ?? 'NA Innovations' }}</div>
                        <div class="company-details">
                            @if(!empty($company['address'])){{ $company['address'] }}<br>@endif
                            @if(!empty($company['email'])){{ $company['email'] }}@endif
                            @if(!empty($company['phone'])) | {{ $company['phone'] }}@endif
                            <br>
                            @if(!empty($company['vat']))TVA: {{ $company['vat'] }}@endif
                            @if(!empty($company['country'])) | {{ $company['country'] }}@endif
                        </div>
                    </td>
                    <td style="width: 45%;">
                        <div class="po-title">{{ __('pdf.purchase_order') }}</div>
                        <div class="po-meta">
                            <strong>{{ __('pdf.po_number') }}</strong> {{ $po->po_number }}<br>
                            <strong>{{ __('pdf.issue_date') }}</strong> {{ $po->issue_date ? $po->issue_date->format('d/m/Y') : '-' }}
                        </div>
                        <div style="text-align: right; margin-top: 6px;">
                            <span style="display: inline-block; padding: 3px 12px; border-radius: 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; background-color: #dbeafe; color: #1d4ed8;">
                                {{ $po->status }}
                            </span>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="accent-line"></div>

        {{-- Quote reference --}}
        @if($po->quote)
            <div class="quote-ref">
                <strong>{{ __('pdf.quote_reference') }}:</strong> {{ $po->quote->quote_number }}
                @if($po->quote->title) — {{ $po->quote->title }}@endif
            </div>
        @endif

        {{-- Client Info --}}
        <div class="client-block">
            <div class="client-block-label">{{ __('pdf.ordered_by') }}</div>
            <div class="client-name">{{ $po->client_name }}</div>
            <div class="client-info">
                @if($po->client_company){{ $po->client_company }}<br>@endif
                @if($po->client_address){{ $po->client_address }}<br>@endif
                @if($po->client_vat){{ __('pdf.vat') }}: {{ $po->client_vat }}<br>@endif
                @if($po->client_email){{ $po->client_email }}@endif
            </div>
        </div>

        {{-- Items --}}
        @php $items = is_array($po->items) ? $po->items : []; @endphp
        @if(count($items))
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 30px;">#</th>
                        <th>{{ __('pdf.description') }}</th>
                        <th class="text-center" style="width: 50px;">{{ __('pdf.qty') }}</th>
                        <th class="text-center" style="width: 50px;">{{ __('pdf.unit') }}</th>
                        <th class="text-right" style="width: 85px;">{{ __('pdf.unit_price') }}</th>
                        <th class="text-right" style="width: 85px;">{{ __('pdf.total') }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $index => $item)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>
                                {{ $item['description'] ?? '' }}
                                @if(!empty($item['details']))
                                    <div class="item-details">{{ $item['details'] }}</div>
                                @endif
                            </td>
                            <td class="text-center">{{ rtrim(rtrim(number_format($item['quantity'] ?? 1, 2, '.', ''), '0'), '.') }}</td>
                            <td class="text-center">{{ $item['unit'] ?? '-' }}</td>
                            <td class="text-right">&euro; {{ number_format($item['unit_price'] ?? 0, 2, ',', '.') }}</td>
                            <td class="text-right">&euro; {{ number_format($item['total'] ?? 0, 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        {{-- Totals --}}
        <div class="totals-wrapper clearfix">
            <table class="totals-table">
                <tr>
                    <td>{{ __('pdf.subtotal') }}</td>
                    <td>&euro; {{ number_format($po->subtotal, 2, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>{{ __('pdf.tax') }} ({{ rtrim(rtrim(number_format($po->tax_rate, 2), '0'), '.') }}%)</td>
                    <td>&euro; {{ number_format($po->tax_amount, 2, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td>{{ __('pdf.total') }}</td>
                    <td>&euro; {{ number_format($po->total, 2, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        {{-- Footer --}}
        <div class="footer">
            {{ $company['name'] ?? 'NA Innovations' }}
            @if(!empty($company['address'])) &mdash; {{ $company['address'] }}@endif
            <br>
            @if(!empty($company['email'])){{ $company['email'] }}@endif
            @if(!empty($company['phone'])) | {{ $company['phone'] }}@endif
            @if(!empty($company['vat'])) | TVA: {{ $company['vat'] }}@endif
        </div>
    </div>
</body>
</html>
