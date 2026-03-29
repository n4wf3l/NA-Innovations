<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #1e293b; line-height: 1.6; margin: 40px; }
        .header { border-bottom: 3px solid #5eead4; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 24px; color: #0f172a; margin: 0; }
        .header p { color: #64748b; font-size: 12px; margin: 5px 0 0; }
        .badge { display: inline-block; background: #f0fdfa; color: #0d9488; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .section { margin-bottom: 25px; }
        .section h2 { font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
        .field { margin-bottom: 12px; }
        .field .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
        .field .value { font-size: 14px; color: #0f172a; font-weight: 500; }
        .notes { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 13px; color: #475569; white-space: pre-wrap; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 8px 0; vertical-align: top; }
        td.label-cell { width: 35%; color: #64748b; font-size: 12px; }
        td.value-cell { font-weight: 500; }
    </style>
</head>
<body>
    <div class="header">
        <h1>NA Innovations</h1>
        <p>Client Referral — Project Details</p>
    </div>

    <div class="section">
        <h2>Contact Information</h2>
        <table>
            <tr><td class="label-cell">Full Name</td><td class="value-cell">{{ $lead['first_name'] }} {{ $lead['last_name'] }}</td></tr>
            <tr><td class="label-cell">Email</td><td class="value-cell">{{ $lead['email'] }}</td></tr>
            @if(!empty($lead['phone']))<tr><td class="label-cell">Phone</td><td class="value-cell">{{ $lead['phone'] }}</td></tr>@endif
            @if(!empty($lead['company_name']))<tr><td class="label-cell">Company</td><td class="value-cell">{{ $lead['company_name'] }}</td></tr>@endif
        </table>
    </div>

    <div class="section">
        <h2>Project Details</h2>
        <table>
            @if(!empty($lead['service_interest']))<tr><td class="label-cell">Service Needed</td><td class="value-cell">{{ $lead['service_interest'] }}</td></tr>@endif
            @if(!empty($lead['estimated_budget']))<tr><td class="label-cell">Estimated Budget</td><td class="value-cell">EUR {{ number_format($lead['estimated_budget'], 2, ',', '.') }}</td></tr>@endif
            <tr><td class="label-cell">Referred By</td><td class="value-cell">{{ $partner_name }}</td></tr>
            <tr><td class="label-cell">Date</td><td class="value-cell">{{ now()->format('d/m/Y') }}</td></tr>
        </table>
    </div>

    @if(!empty($lead['notes']))
    <div class="section">
        <h2>Additional Notes</h2>
        <div class="notes">{{ $lead['notes'] }}</div>
    </div>
    @endif

    <div class="footer">
        {{ config('mail.from.name', 'NA Innovations') }} — {{ config('mail.from.address') }} — {{ str_replace(['https://', 'http://'], '', config('app.url')) }}
    </div>
</body>
</html>
