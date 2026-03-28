<!DOCTYPE html>
<html lang="{{ $document->locale ?? 'fr' }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $document->title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Serif', Georgia, serif;
            font-size: 11pt;
            color: #000000;
            line-height: 1.7;
            background: #ffffff;
        }

        .page {
            padding: 40px 50px;
        }

        /* ── Header ───────────────────────────────── */
        .header {
            width: 100%;
            margin-bottom: 25px;
            border-bottom: 2px solid #000000;
            padding-bottom: 15px;
        }
        .header table {
            width: 100%;
        }
        .header td {
            vertical-align: top;
        }
        .company-name {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 2px;
        }
        .company-info {
            text-align: right;
            font-size: 9pt;
            color: #444444;
            line-height: 1.8;
        }

        /* ── Reference block ─────────────────────── */
        .reference-block {
            margin-bottom: 25px;
            font-size: 10pt;
            color: #333333;
        }
        .reference-block table {
            border-collapse: collapse;
        }
        .reference-block td {
            padding: 2px 10px 2px 0;
        }
        .reference-block .label {
            font-weight: bold;
            color: #000000;
        }

        /* ── Content ──────────────────────────────── */
        .document-content {
            margin: 30px 20px;
            font-family: 'DejaVu Serif', Georgia, serif;
            font-size: 11pt;
            line-height: 1.8;
            text-align: justify;
        }
        .document-content h1, .document-content h2, .document-content h3 {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            color: #000000;
            margin: 18px 0 10px 0;
        }
        .document-content h1 { font-size: 18px; }
        .document-content h2 { font-size: 15px; }
        .document-content h3 { font-size: 13px; }
        .document-content p {
            margin-bottom: 12px;
        }
        .document-content ul, .document-content ol {
            margin-left: 25px;
            margin-bottom: 12px;
        }
        .document-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
        }
        .document-content table td,
        .document-content table th {
            border: 1px solid #cccccc;
            padding: 6px 10px;
            font-size: 10pt;
        }

        /* ── Signatures ───────────────────────────── */
        .signatures {
            margin-top: 50px;
            width: 100%;
            page-break-inside: avoid;
        }
        .signatures table {
            width: 100%;
        }
        .signatures td {
            width: 50%;
            vertical-align: top;
            padding: 8px;
        }
        .signature-box {
            border: 2px dotted #999999;
            padding: 15px;
            min-height: 150px;
        }
        .signature-title {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            font-size: 10pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #cccccc;
        }
        .signature-name {
            font-size: 11pt;
            font-weight: bold;
            color: #000000;
            margin-bottom: 4px;
        }
        .signature-date {
            font-size: 9pt;
            color: #555555;
            margin-bottom: 10px;
        }
        .signature-image {
            max-width: 200px;
            max-height: 80px;
        }
        .signature-pending {
            font-size: 10pt;
            color: #999999;
            font-style: italic;
            margin-top: 25px;
        }

        /* ── Footer ───────────────────────────────── */
        .footer {
            margin-top: 40px;
            background-color: #f5f5f5;
            padding: 12px 16px;
            font-size: 8pt;
            color: #666666;
            line-height: 1.7;
        }
        .footer .footer-title {
            font-weight: bold;
            color: #333333;
            margin-bottom: 4px;
            font-size: 8pt;
        }
        .footer table {
            width: 100%;
            border-collapse: collapse;
        }
        .footer td {
            vertical-align: top;
            padding: 1px 0;
            font-size: 8pt;
        }
        .footer .legal {
            margin-top: 8px;
            font-size: 7pt;
            color: #888888;
            font-style: italic;
            border-top: 1px solid #dddddd;
            padding-top: 6px;
        }
    </style>
</head>
<body>
    <div class="page">

        {{-- ── Header ── --}}
        <div class="header">
            <table>
                <tr>
                    <td style="width: 50%;">
                        <div class="company-name">NA Innovations</div>
                    </td>
                    <td style="width: 50%;">
                        <div class="company-info">
                            {{ $company['address'] }}<br>
                            @if($company['email']){{ $company['email'] }}<br>@endif
                            @if($company['phone']){{ $company['phone'] }}<br>@endif
                            @if($company['vat'])TVA : {{ $company['vat'] }}@endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        {{-- ── Reference block ── --}}
        <div class="reference-block">
            <table>
                @if($document->document_reference)
                <tr>
                    <td class="label">Référence :</td>
                    <td>{{ $document->document_reference }}</td>
                </tr>
                @endif
                <tr>
                    <td class="label">Date de création :</td>
                    <td>{{ $document->created_at->format('d/m/Y') }}</td>
                </tr>
                @if($document->project)
                <tr>
                    <td class="label">Projet :</td>
                    <td>{{ $document->project->nom_societe }}</td>
                </tr>
                @endif
                @if($document->project && $document->project->client)
                <tr>
                    <td class="label">Client :</td>
                    <td>
                        {{ $document->project->client->name }}
                        @if($document->project->client->company_name)
                            ({{ $document->project->client->company_name }})
                        @endif
                    </td>
                </tr>
                @endif
            </table>
        </div>

        {{-- ── Content ── --}}
        <div class="document-content">
            {!! $document->content !!}
        </div>

        {{-- ── Signatures ── --}}
        <div class="signatures">
            <table>
                <tr>
                    <td>
                        <div class="signature-box">
                            <div class="signature-title">Pour NA Innovations</div>
                            @if($document->admin_signed_at && $document->adminSigner)
                                @if($document->admin_signature_data)
                                    <img src="{{ $document->admin_signature_data }}" class="signature-image" alt="Signature administrateur">
                                @endif
                                <div class="signature-name">{{ $document->adminSigner->name }}</div>
                                <div class="signature-date">Signé le {{ $document->admin_signed_at->format('d/m/Y à H:i') }}</div>
                            @else
                                <div class="signature-pending">En attente de signature</div>
                            @endif
                        </div>
                    </td>
                    <td>
                        <div class="signature-box">
                            <div class="signature-title">Pour le client</div>
                            @if($document->client_signed_at && $document->clientSigner)
                                @if($document->client_signature_data)
                                    <img src="{{ $document->client_signature_data }}" class="signature-image" alt="Signature client">
                                @endif
                                <div class="signature-name">{{ $document->clientSigner->name }}</div>
                                <div class="signature-date">Signé le {{ $document->client_signed_at->format('d/m/Y à H:i') }}</div>
                            @else
                                <div class="signature-pending">En attente de signature</div>
                            @endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        {{-- ── Footer ── --}}
        <div class="footer">
            <div class="footer-title">Informations du document</div>
            <table>
                @if($document->document_reference)
                <tr>
                    <td style="width: 35%;"><strong>Référence :</strong> {{ $document->document_reference }}</td>
                    <td style="width: 65%;"><strong>Date de création :</strong> {{ $document->created_at->format('d/m/Y à H:i') }}</td>
                </tr>
                @endif
                @if($document->admin_signed_at || $document->client_signed_at)
                <tr>
                    <td colspan="2" style="padding-top: 4px;">
                        <strong>Détails des signatures :</strong><br>
                        @if($document->admin_signed_at && $document->adminSigner)
                            Administrateur : {{ $document->adminSigner->name }} — {{ $document->admin_signed_at->format('d/m/Y à H:i') }}
                            @if($document->admin_signed_ip) — IP : {{ $document->admin_signed_ip }}@endif
                            <br>
                        @endif
                        @if($document->client_signed_at && $document->clientSigner)
                            Client : {{ $document->clientSigner->name }} — {{ $document->client_signed_at->format('d/m/Y à H:i') }}
                            @if($document->client_signed_ip) — IP : {{ $document->client_signed_ip }}@endif
                            <br>
                        @endif
                    </td>
                </tr>
                @endif
                @if($document->pdf_hash)
                <tr>
                    <td colspan="2" style="padding-top: 4px;">
                        <strong>Empreinte SHA-256 :</strong> {{ $document->pdf_hash }}
                    </td>
                </tr>
                @endif
            </table>
            <div class="legal">
                Ce document électronique a été généré et signé conformément au règlement (UE) n° 910/2014 (eIDAS)
                relatif à l'identification électronique et aux services de confiance pour les transactions électroniques.
                La signature électronique apposée sur ce document a la même valeur juridique qu'une signature manuscrite
                conformément à l'article 25 du règlement eIDAS. L'intégrité du document peut être vérifiée
                à l'aide de l'empreinte SHA-256 ci-dessus.
            </div>
        </div>

    </div>
</body>
</html>
