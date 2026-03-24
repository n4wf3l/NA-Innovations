<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Quote {{ $quote->quote_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #111827;
            line-height: 1.5;
            background: #ffffff;
        }

        .page {
            padding: 40px 50px;
        }

        /* ── Header ───────────────────────────────── */
        .header {
            width: 100%;
            margin-bottom: 30px;
        }
        .header table {
            width: 100%;
        }
        .header td {
            vertical-align: top;
        }
        .company-name {
            font-size: 22px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
        }
        .company-details {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.6;
        }
        .quote-title {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            text-align: right;
            letter-spacing: 2px;
        }
        .quote-meta {
            text-align: right;
            font-size: 10px;
            color: #6b7280;
            margin-top: 8px;
            line-height: 1.8;
        }
        .quote-meta strong {
            color: #111827;
        }

        .accent-line {
            height: 3px;
            background-color: #5eead4;
            margin-bottom: 25px;
        }

        /* ── Client Block ─────────────────────────── */
        .client-block {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 15px 18px;
            margin-bottom: 25px;
        }
        .client-block-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
            margin-bottom: 6px;
            font-weight: bold;
        }
        .client-block .client-name {
            font-size: 14px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 2px;
        }
        .client-block .client-info {
            font-size: 10px;
            color: #6b7280;
            line-height: 1.6;
        }

        /* ── Quote Title ──────────────────────────── */
        .quote-subject {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 8px;
        }

        /* ── Introduction ─────────────────────────── */
        .introduction {
            font-size: 11px;
            color: #374151;
            margin-bottom: 25px;
            line-height: 1.7;
        }

        /* ── Items Table ──────────────────────────── */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table thead th {
            background-color: #111827;
            color: #ffffff;
            padding: 8px 10px;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            text-align: left;
        }
        .items-table thead th:first-child {
            border-radius: 4px 0 0 0;
        }
        .items-table thead th:last-child {
            border-radius: 0 4px 0 0;
            text-align: right;
        }
        .items-table thead th.text-right {
            text-align: right;
        }
        .items-table thead th.text-center {
            text-align: center;
        }
        .items-table tbody td {
            padding: 10px 10px;
            font-size: 11px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
        }
        .items-table tbody td.text-right {
            text-align: right;
        }
        .items-table tbody td.text-center {
            text-align: center;
        }
        .items-table tbody tr:last-child td {
            border-bottom: none;
        }
        .optional-tag {
            color: #9ca3af;
            font-size: 9px;
            font-style: italic;
        }
        .item-details {
            font-size: 9px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* ── Totals ───────────────────────────────── */
        .totals-wrapper {
            width: 100%;
            margin-bottom: 25px;
        }
        .totals-table {
            width: 280px;
            float: right;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 5px 10px;
            font-size: 11px;
        }
        .totals-table td:first-child {
            color: #6b7280;
            text-align: left;
        }
        .totals-table td:last-child {
            text-align: right;
            font-weight: 600;
            color: #111827;
        }
        .totals-table .total-row td {
            border-top: 2px solid #5eead4;
            padding-top: 8px;
            font-size: 14px;
            font-weight: bold;
            color: #111827;
        }
        .totals-table .deposit-row td {
            font-size: 11px;
            color: #5eead4;
            font-weight: 600;
            border-top: 1px solid #e5e7eb;
            padding-top: 6px;
        }
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        /* ── Sections ─────────────────────────────── */
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #5eead4;
            padding-bottom: 5px;
            margin-bottom: 8px;
        }
        .section-content {
            font-size: 10px;
            color: #374151;
            line-height: 1.7;
            white-space: pre-line;
        }

        /* ── Validity ─────────────────────────────── */
        .validity {
            background-color: #f0fdfa;
            border: 1px solid #5eead4;
            border-radius: 4px;
            padding: 10px 15px;
            font-size: 11px;
            color: #111827;
            text-align: center;
            margin-bottom: 25px;
        }
        .validity strong {
            color: #111827;
        }

        /* ── Footer ───────────────────────────────── */
        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            text-align: center;
            font-size: 9px;
            color: #9ca3af;
            line-height: 1.6;
            position: fixed;
            bottom: 30px;
            left: 50px;
            right: 50px;
        }
    </style>
</head>
<body>
    <div class="page">
        {{-- Header --}}
        <div class="header">
            <table>
                <tr>
                    <td style="width: 55%;">
                        <div class="company-name">{{ $company['name'] ?? 'NA Innovations' }}</div>
                        <div class="company-details">
                            @if(!empty($company['address'])){{ $company['address'] }}<br>@endif
                            @if(!empty($company['email'])){{ $company['email'] }}@endif
                            @if(!empty($company['phone'])) | {{ $company['phone'] }}@endif
                            <br>
                            @if(!empty($company['vat']))VAT: {{ $company['vat'] }}@endif
                            @if(!empty($company['country'])) | {{ $company['country'] }}@endif
                        </div>
                    </td>
                    <td style="width: 45%;">
                        <div class="quote-title">QUOTE</div>
                        <div class="quote-meta">
                            <strong>Quote #:</strong> {{ $quote->quote_number }}<br>
                            <strong>Issue Date:</strong> {{ $quote->issue_date ? $quote->issue_date->format('d/m/Y') : '-' }}<br>
                            <strong>Valid Until:</strong> {{ $quote->valid_until ? $quote->valid_until->format('d/m/Y') : '-' }}
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="accent-line"></div>

        {{-- Client Info --}}
        <div class="client-block">
            <div class="client-block-label">Billed To</div>
            <div class="client-name">{{ $quote->client_name }}</div>
            <div class="client-info">
                @if($quote->client_company){{ $quote->client_company }}<br>@endif
                @if($quote->client_address){{ $quote->client_address }}<br>@endif
                @if($quote->client_vat)VAT: {{ $quote->client_vat }}<br>@endif
                @if($quote->client_email){{ $quote->client_email }}@endif
            </div>
        </div>

        {{-- Quote Title --}}
        @if($quote->title)
            <div class="quote-subject">{{ $quote->title }}</div>
        @endif

        {{-- Introduction --}}
        @if($quote->introduction)
            <div class="introduction">{!! nl2br(e($quote->introduction)) !!}</div>
        @endif

        {{-- Line Items --}}
        @if($quote->items && $quote->items->count())
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 30px;">#</th>
                        <th>Description</th>
                        <th class="text-center" style="width: 50px;">Qty</th>
                        <th class="text-center" style="width: 50px;">Unit</th>
                        <th class="text-right" style="width: 85px;">Unit Price</th>
                        <th class="text-right" style="width: 85px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($quote->items->sortBy('sort_order') as $index => $item)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>
                                {{ $item->description }}
                                @if($item->is_optional)
                                    <span class="optional-tag">(optional)</span>
                                @endif
                                @if($item->details)
                                    <div class="item-details">{{ $item->details }}</div>
                                @endif
                            </td>
                            <td class="text-center">{{ rtrim(rtrim(number_format($item->quantity, 2, '.', ''), '0'), '.') }}</td>
                            <td class="text-center">{{ $item->unit ?? '-' }}</td>
                            <td class="text-right">&euro; {{ number_format($item->unit_price, 2, ',', '.') }}</td>
                            <td class="text-right">&euro; {{ number_format($item->total, 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        {{-- Totals --}}
        <div class="totals-wrapper clearfix">
            <table class="totals-table">
                <tr>
                    <td>Subtotal</td>
                    <td>&euro; {{ number_format($quote->subtotal, 2, ',', '.') }}</td>
                </tr>
                @if($quote->discount_amount > 0)
                    <tr>
                        <td>Discount</td>
                        <td>- &euro; {{ number_format($quote->discount_amount, 2, ',', '.') }}</td>
                    </tr>
                @endif
                <tr>
                    <td>Tax ({{ rtrim(rtrim(number_format($quote->tax_rate, 2), '0'), '.') }}%)</td>
                    <td>&euro; {{ number_format($quote->tax_amount, 2, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td>Total</td>
                    <td>&euro; {{ number_format($quote->total, 2, ',', '.') }}</td>
                </tr>
                @if($quote->deposit_amount > 0)
                    <tr class="deposit-row">
                        <td>Deposit ({{ $quote->deposit_percentage }}%)</td>
                        <td>&euro; {{ number_format($quote->deposit_amount, 2, ',', '.') }}</td>
                    </tr>
                @endif
            </table>
        </div>

        {{-- Scope of Work --}}
        @if($quote->scope_of_work)
            <div class="section">
                <div class="section-title">Scope of Work</div>
                <div class="section-content">{{ $quote->scope_of_work }}</div>
            </div>
        @endif

        {{-- Exclusions --}}
        @if($quote->exclusions)
            <div class="section">
                <div class="section-title">Exclusions</div>
                <div class="section-content">{{ $quote->exclusions }}</div>
            </div>
        @endif

        {{-- Terms and Conditions --}}
        @if($quote->terms_and_conditions)
            <div class="section">
                <div class="section-title">Terms and Conditions</div>
                <div class="section-content">{{ $quote->terms_and_conditions }}</div>
            </div>
        @endif

        {{-- Validity --}}
        @if($quote->valid_until)
            <div class="validity">
                This quote is valid until <strong>{{ $quote->valid_until->format('d/m/Y') }}</strong>.
            </div>
        @endif

        {{-- Footer --}}
        <div class="footer">
            {{ $company['name'] ?? 'NA Innovations' }}
            @if(!empty($company['address'])) &mdash; {{ $company['address'] }}@endif
            <br>
            @if(!empty($company['email'])){{ $company['email'] }}@endif
            @if(!empty($company['phone'])) | {{ $company['phone'] }}@endif
            @if(!empty($company['vat'])) | VAT: {{ $company['vat'] }}@endif
            @if(!empty($company['bank_iban']))
                <br>IBAN: {{ $company['bank_iban'] }}
                @if(!empty($company['bank_bic'])) | BIC: {{ $company['bank_bic'] }}@endif
            @endif
        </div>
    </div>
</body>
</html>
