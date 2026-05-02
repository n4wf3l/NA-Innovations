<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $variables = json_encode([
            'admin_name', 'date',
            'pending_quotes', 'overdue_invoices', 'overdue_amount',
            'projects_in_review', 'services_expiring_7d',
            'new_leads_24h', 'payments_24h_count', 'payments_24h_amount',
            'commissions_pending', 'dashboard_url',
        ]);

        $now = now();

        $bodyFr = <<<HTML
<p>Bonjour {{ admin_name }},</p>
<p>Voici ce qui s'est passé sur ta plateforme le <strong>{{ date }}</strong> :</p>
<ul>
    <li><strong>{{ pending_quotes }}</strong> devis en attente (envoyés ou consultés)</li>
    <li><strong>{{ overdue_invoices }}</strong> factures en retard - <strong>{{ overdue_amount }} €</strong></li>
    <li><strong>{{ projects_in_review }}</strong> projets passés en review cette semaine</li>
    <li><strong>{{ services_expiring_7d }}</strong> services à renouveler dans les 7 jours</li>
    <li><strong>{{ new_leads_24h }}</strong> nouveaux leads (24 dernières heures)</li>
    <li><strong>{{ payments_24h_count }}</strong> paiements reçus hier - <strong>{{ payments_24h_amount }} €</strong></li>
    <li><strong>{{ commissions_pending }}</strong> commissions en attente</li>
</ul>
<p><a href="{{ dashboard_url }}"><strong>Ouvrir le dashboard →</strong></a></p>
<p>Cordialement,<br>NA Innovations</p>
HTML;

        $bodyEn = <<<HTML
<p>Hello {{ admin_name }},</p>
<p>Here's what happened on your platform on <strong>{{ date }}</strong>:</p>
<ul>
    <li><strong>{{ pending_quotes }}</strong> quotes awaiting (sent or viewed)</li>
    <li><strong>{{ overdue_invoices }}</strong> overdue invoices - <strong>{{ overdue_amount }} €</strong></li>
    <li><strong>{{ projects_in_review }}</strong> projects moved to review this week</li>
    <li><strong>{{ services_expiring_7d }}</strong> services expiring within 7 days</li>
    <li><strong>{{ new_leads_24h }}</strong> new leads (last 24 hours)</li>
    <li><strong>{{ payments_24h_count }}</strong> payments received yesterday - <strong>{{ payments_24h_amount }} €</strong></li>
    <li><strong>{{ commissions_pending }}</strong> commissions pending</li>
</ul>
<p><a href="{{ dashboard_url }}"><strong>Open the dashboard →</strong></a></p>
<p>Best regards,<br>NA Innovations</p>
HTML;

        $bodyNl = <<<HTML
<p>Hallo {{ admin_name }},</p>
<p>Dit is wat er op <strong>{{ date }}</strong> gebeurd is op je platform:</p>
<ul>
    <li><strong>{{ pending_quotes }}</strong> offertes in behandeling (verzonden of bekeken)</li>
    <li><strong>{{ overdue_invoices }}</strong> facturen over tijd - <strong>{{ overdue_amount }} €</strong></li>
    <li><strong>{{ projects_in_review }}</strong> projecten in review deze week</li>
    <li><strong>{{ services_expiring_7d }}</strong> diensten vervallen binnen 7 dagen</li>
    <li><strong>{{ new_leads_24h }}</strong> nieuwe leads (laatste 24 uur)</li>
    <li><strong>{{ payments_24h_count }}</strong> betalingen ontvangen gisteren - <strong>{{ payments_24h_amount }} €</strong></li>
    <li><strong>{{ commissions_pending }}</strong> commissies in afwachting</li>
</ul>
<p><a href="{{ dashboard_url }}"><strong>Open het dashboard →</strong></a></p>
<p>Met vriendelijke groeten,<br>NA Innovations</p>
HTML;

        $rows = [
            [
                'locale' => 'fr',
                'name' => 'Digest quotidien admin',
                'subject' => 'Ton digest NA Innovations - {{ date }}',
                'body' => $bodyFr,
            ],
            [
                'locale' => 'en',
                'name' => 'Admin daily digest',
                'subject' => 'Your NA Innovations digest - {{ date }}',
                'body' => $bodyEn,
            ],
            [
                'locale' => 'nl',
                'name' => 'Admin dagelijkse digest',
                'subject' => 'Je NA Innovations digest - {{ date }}',
                'body' => $bodyNl,
            ],
        ];

        foreach ($rows as $row) {
            DB::table('email_templates')->updateOrInsert(
                ['slug' => 'admin-daily-digest', 'locale' => $row['locale']],
                [
                    'name' => $row['name'],
                    'subject' => $row['subject'],
                    'body' => $row['body'],
                    'available_variables' => $variables,
                    'category' => 'admin',
                    'is_active' => true,
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        DB::table('email_templates')->where('slug', 'admin-daily-digest')->delete();
    }
};
