<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $emailSubject ?? '' }}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #111827, #1f2937); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center; }
        .header-logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
        .header-sub { color: #9ca3af; font-size: 12px; margin-top: 4px; }
        .body { background-color: #ffffff; padding: 40px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; }
        .body p { color: #374151; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0; }
        .body strong { color: #111827; }
        .body blockquote { margin: 16px 0; padding: 12px 20px; background: #f9fafb; border-left: 4px solid #5eead4; border-radius: 0 8px 8px 0; color: #374151; font-size: 14px; line-height: 1.6; }
        .body a { color: #0d9488; text-decoration: underline; }
        .footer { background-color: #f9fafb; padding: 24px 40px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center; }
        .footer p { color: #9ca3af; font-size: 11px; line-height: 1.6; margin: 0; }
        .footer a { color: #6b7280; text-decoration: none; }
        .accent-line { height: 3px; background: linear-gradient(90deg, #5eead4, #2dd4bf, #14b8a6); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="header-logo">NA Innovations</div>
                <div class="header-sub">Web &amp; Mobile Development</div>
            </div>
            <div class="accent-line"></div>
            <div class="body">
                {!! $body !!}

                @if(\App\Models\Setting::get('email_signature.enabled', '1') === '1')
                @php
                    $sigColor = \App\Models\Setting::get('email_signature.color', '#0d9488');
                    $sigLogo = \App\Models\Setting::get('email_signature.logo_path', '');
                    $sigName = \App\Models\Setting::get('email_signature.name', '');
                    $sigTitle = \App\Models\Setting::get('email_signature.title', '');
                    $sigCompany = \App\Models\Setting::get('email_signature.company', '');
                    $sigPhone = \App\Models\Setting::get('email_signature.phone', '');
                    $sigEmail = \App\Models\Setting::get('email_signature.email', '');
                    $sigWebsite = \App\Models\Setting::get('email_signature.website', '');
                    $sigAddress = \App\Models\Setting::get('email_signature.address', '');
                    $sigLinkedin = \App\Models\Setting::get('email_signature.linkedin', '');
                    $sigInstagram = \App\Models\Setting::get('email_signature.instagram', '');
                    $sigGithub = \App\Models\Setting::get('email_signature.github', '');
                    $sigLogoUrl = $sigLogo ? asset('storage/' . $sigLogo) : '';
                @endphp
                @if($sigName)
                <div style="border-top: 2px solid {{ $sigColor }}; padding-top: 16px; margin-top: 24px;">
                    <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
                        <tr>
                            @if($sigLogoUrl)
                            <td style="padding-right: 16px; vertical-align: top;">
                                <img src="{{ $sigLogoUrl }}" alt="Logo" style="height: 50px; width: auto;" />
                            </td>
                            @endif
                            <td style="vertical-align: top;{{ $sigLogoUrl ? ' border-left: 2px solid ' . $sigColor . '20; padding-left: 16px;' : '' }}">
                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">{{ $sigName }}</p>
                                @if($sigTitle)<p style="margin: 2px 0 0; font-size: 12px; color: {{ $sigColor }}; font-weight: 600;">{{ $sigTitle }}</p>@endif
                                @if($sigCompany)<p style="margin: 2px 0 0; font-size: 11px; color: #6b7280;">{{ $sigCompany }}</p>@endif
                                <div style="margin-top: 8px; font-size: 11px; color: #6b7280; line-height: 1.6;">
                                    @if($sigPhone)<span style="font-weight: 600; color: #374151;">T.</span> {{ $sigPhone }}<br>@endif
                                    @if($sigEmail)<span style="font-weight: 600; color: #374151;">E.</span> {{ $sigEmail }}<br>@endif
                                    @if($sigWebsite)<span style="font-weight: 600; color: #374151;">W.</span> {{ $sigWebsite }}<br>@endif
                                    @if($sigAddress)<span style="font-weight: 600; color: #374151;">A.</span> {{ $sigAddress }}@endif
                                </div>
                                @if($sigLinkedin || $sigInstagram || $sigGithub)
                                <div style="margin-top: 8px;">
                                    @if($sigLinkedin)<a href="{{ $sigLinkedin }}" style="color: {{ $sigColor }}; font-size: 11px; text-decoration: none; font-weight: 600; margin-right: 8px;">LinkedIn</a>@endif
                                    @if($sigInstagram)<a href="{{ $sigInstagram }}" style="color: {{ $sigColor }}; font-size: 11px; text-decoration: none; font-weight: 600; margin-right: 8px;">Instagram</a>@endif
                                    @if($sigGithub)<a href="{{ $sigGithub }}" style="color: {{ $sigColor }}; font-size: 11px; text-decoration: none; font-weight: 600;">GitHub</a>@endif
                                </div>
                                @endif
                            </td>
                        </tr>
                    </table>
                </div>
                @endif
                @endif
            </div>
            <div class="footer">
                <p>
                    {{ config('mail.from.name', 'NA Innovations') }} &mdash; 170 Nijverheidskaai, Anderlecht<br>
                    <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a>
                    &nbsp;&middot;&nbsp;
                    <a href="{{ config('app.url') }}">{{ str_replace(['https://', 'http://'], '', config('app.url')) }}</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
