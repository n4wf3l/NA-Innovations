<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $invoice->invoice_number }}</title>
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
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            text-align: right;
            letter-spacing: 2px;
        }
        .invoice-meta {
            text-align: right;
            font-size: 10px;
            color: #6b7280;
            margin-top: 8px;
            line-height: 1.8;
        }
        .invoice-meta strong {
            color: #111827;
        }

        .accent-line {
            height: 3px;
            background-color: #5eead4;
            margin-bottom: 25px;
        }

        /* ── Type Badge ───────────────────────────── */
        .type-badge {
            display: inline-block;
            padding: 3px 12px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 6px;
        }
        .type-badge.deposit {
            background-color: #dbeafe;
            color: #1d4ed8;
        }
        .type-badge.final {
            background-color: #d1fae5;
            color: #047857;
        }
        .type-badge.standalone {
            background-color: #e0e7ff;
            color: #4338ca;
        }
        .type-badge.credit_note {
            background-color: #fee2e2;
            color: #b91c1c;
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

        /* ── Invoice Title ────────────────────────── */
        .invoice-subject {
            font-size: 16px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 20px;
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
        .totals-table .paid-row td {
            color: #059669;
            font-size: 11px;
        }
        .totals-table .due-row td {
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
            font-size: 13px;
            font-weight: bold;
            color: #111827;
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

        /* ── Bank Details ─────────────────────────── */
        .bank-details {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 15px 18px;
            margin-bottom: 25px;
        }
        .bank-details-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
            margin-bottom: 6px;
            font-weight: bold;
        }
        .bank-details table {
            border-collapse: collapse;
        }
        .bank-details table td {
            font-size: 10px;
            padding: 2px 10px 2px 0;
        }
        .bank-details table td:first-child {
            color: #6b7280;
            font-weight: 600;
        }
        .bank-details table td:last-child {
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
                        <img src="{{ public_path('dark-logo.png') }}" style="height: 40px; width: auto; margin-bottom: 8px;" alt="NA Innovations">
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
                        <div class="invoice-title">
                            @if($invoice->type === 'credit_note')
                                {{ __('pdf.credit_note') }}
                            @else
                                {{ __('pdf.invoice') }}
                            @endif
                        </div>
                        <div class="invoice-meta">
                            <strong>{{ __('pdf.invoice_number') }}</strong> {{ $invoice->invoice_number }}<br>
                            <strong>{{ __('pdf.issue_date') }}</strong> {{ $invoice->issue_date ? $invoice->issue_date->format('d/m/Y') : '-' }}<br>
                            <strong>{{ __('pdf.due_date') }}</strong> {{ $invoice->due_date ? $invoice->due_date->format('d/m/Y') : '-' }}
                        </div>
                        @if($invoice->type)
                            <div style="text-align: right; margin-top: 6px;">
                                <span class="type-badge {{ $invoice->type }}">
                                    {{ str_replace('_', ' ', $invoice->type) }}
                                </span>
                            </div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>

        <div class="accent-line"></div>

        {{-- Client Info --}}
        <div class="client-block">
            <div class="client-block-label">{{ __('pdf.billed_to') }}</div>
            <div class="client-name">{{ $invoice->client_name }}</div>
            <div class="client-info">
                @if($invoice->client_company){{ $invoice->client_company }}<br>@endif
                @if($invoice->client_address){{ $invoice->client_address }}<br>@endif
                @if($invoice->client_vat){{ __('pdf.vat') }}: {{ $invoice->client_vat }}<br>@endif
                @if($invoice->client_email){{ $invoice->client_email }}@endif
            </div>
        </div>

        {{-- Credit Note Reference --}}
        @if($invoice->type === 'credit_note' && $invoice->credit_note_for)
            @php $originalInvoice = \App\Models\Invoice::find($invoice->credit_note_for); @endphp
            @if($originalInvoice)
                <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 4px; padding: 10px 15px; margin-bottom: 15px; font-size: 11px; color: #991b1b;">
                    <strong>{{ __('pdf.credit_note_for_invoice') }}:</strong> {{ $originalInvoice->invoice_number }}
                    @if($originalInvoice->issue_date)
                        ({{ $originalInvoice->issue_date->format('d/m/Y') }})
                    @endif
                </div>
            @endif
        @endif

        {{-- Invoice Title --}}
        @if($invoice->title)
            <div class="invoice-subject">{{ $invoice->title }}</div>
        @endif

        {{-- Line Items --}}
        @if($invoice->items && $invoice->items->count())
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
                    @foreach($invoice->items->sortBy('sort_order') as $index => $item)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>
                                {{ $item->description }}
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
                    <td>{{ __('pdf.subtotal') }}</td>
                    <td>&euro; {{ number_format($invoice->subtotal, 2, ',', '.') }}</td>
                </tr>
                @if($invoice->discount_amount > 0)
                    <tr>
                        <td>{{ __('pdf.discount') }}</td>
                        <td>- &euro; {{ number_format($invoice->discount_amount, 2, ',', '.') }}</td>
                    </tr>
                @endif
                <tr>
                    <td>{{ __('pdf.tax') }} ({{ rtrim(rtrim(number_format($invoice->tax_rate, 2), '0'), '.') }}%)</td>
                    <td>&euro; {{ number_format($invoice->tax_amount, 2, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td>{{ __('pdf.total') }}</td>
                    <td>&euro; {{ number_format($invoice->total, 2, ',', '.') }}</td>
                </tr>
                @if($invoice->amount_paid > 0)
                    <tr class="paid-row">
                        <td>{{ __('pdf.amount_paid') }}</td>
                        <td>- &euro; {{ number_format($invoice->amount_paid, 2, ',', '.') }}</td>
                    </tr>
                @endif
                <tr class="due-row">
                    <td>{{ __('pdf.amount_due') }}</td>
                    <td>&euro; {{ number_format($invoice->amount_due, 2, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        {{-- Payment Instructions --}}
        @if($invoice->payment_instructions)
            <div class="section">
                <div class="section-title">{{ __('pdf.payment_instructions') }}</div>
                <div class="section-content">{{ $invoice->payment_instructions }}</div>
            </div>
        @endif

        {{-- Bank Details --}}
        @if(!empty($company['bank_iban']))
            <div class="bank-details">
                <div class="bank-details-label">{{ __('pdf.bank_details') }}</div>
                <table>
                    @if(!empty($company['bank_name']))
                        <tr>
                            <td>{{ __('pdf.bank') }}</td>
                            <td>{{ $company['bank_name'] }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td>IBAN</td>
                        <td>{{ $company['bank_iban'] }}</td>
                    </tr>
                    @if(!empty($company['bank_bic']))
                        <tr>
                            <td>BIC</td>
                            <td>{{ $company['bank_bic'] }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td>{{ __('pdf.reference') }}</td>
                        <td>{{ $invoice->invoice_number }}</td>
                    </tr>
                </table>
            </div>
        @endif

        {{-- Notes --}}
        @if($invoice->notes)
            <div class="section">
                <div class="section-title">{{ __('pdf.notes') }}</div>
                <div class="section-content">{{ $invoice->notes }}</div>
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
        </div>
    </div>
</body>
</html>
