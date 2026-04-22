<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $templates = [
            // ════════════════════════════ PARTNER ════════════════════════════
            [
                'slug' => 'partner-welcome',
                'category' => 'onboarding',
                'variables' => ['user_name', 'email', 'referral_code', 'commission_rate', 'portal_url'],
                'fr' => [
                    'name' => 'Bienvenue partenaire',
                    'subject' => 'Bienvenue chez NA Innovations — ton compte partenaire est prêt',
                    'body' => '<p>Bonjour {{ user_name }},</p><p>Ton compte partenaire NA Innovations vient d\'être créé.</p><ul><li>Email de connexion : <strong>{{ email }}</strong></li><li>Ton code de parrainage : <strong>{{ referral_code }}</strong></li><li>Commission par défaut : <strong>{{ commission_rate }} %</strong></li></ul><p>Tu vas recevoir un second email avec un lien pour définir ton mot de passe. Une fois fait, connecte-toi sur <a href="{{ portal_url }}">{{ portal_url }}</a>.</p><p>À très vite,<br><strong>NA Innovations</strong></p>',
                ],
                'en' => [
                    'name' => 'Partner welcome',
                    'subject' => 'Welcome to NA Innovations — your partner account is ready',
                    'body' => '<p>Hello {{ user_name }},</p><p>Your NA Innovations partner account has just been created.</p><ul><li>Login email: <strong>{{ email }}</strong></li><li>Your referral code: <strong>{{ referral_code }}</strong></li><li>Default commission: <strong>{{ commission_rate }} %</strong></li></ul><p>You will receive a second email with a link to set your password. Once done, log in at <a href="{{ portal_url }}">{{ portal_url }}</a>.</p><p>Talk soon,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Partner welkom',
                    'subject' => 'Welkom bij NA Innovations — je partneraccount staat klaar',
                    'body' => '<p>Hallo {{ user_name }},</p><p>Je NA Innovations partneraccount is aangemaakt.</p><ul><li>Login e-mail: <strong>{{ email }}</strong></li><li>Je referralcode: <strong>{{ referral_code }}</strong></li><li>Standaard commissie: <strong>{{ commission_rate }} %</strong></li></ul><p>Je ontvangt een tweede e-mail met een link om je wachtwoord in te stellen. Log daarna in op <a href="{{ portal_url }}">{{ portal_url }}</a>.</p><p>Tot snel,<br><strong>NA Innovations</strong></p>',
                ],
            ],
            // ════════════════════════════ DEVELOPER ════════════════════════════
            [
                'slug' => 'developer-welcome',
                'category' => 'onboarding',
                'variables' => ['user_name', 'email', 'portal_url'],
                'fr' => [
                    'name' => 'Bienvenue développeur',
                    'subject' => 'Bienvenue chez NA Innovations — ton compte développeur est prêt',
                    'body' => '<p>Bonjour {{ user_name }},</p><p>Ton compte développeur NA Innovations vient d\'être créé.</p><ul><li>Email de connexion : <strong>{{ email }}</strong></li><li>Portail développeur : <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>Tu vas recevoir un second email avec un lien pour définir ton mot de passe. Une fois connecté, tu pourras voir les projets qui te sont assignés, consigner tes heures, et suivre tes livrables.</p><p>À bientôt,<br><strong>NA Innovations</strong></p>',
                ],
                'en' => [
                    'name' => 'Developer welcome',
                    'subject' => 'Welcome to NA Innovations — your developer account is ready',
                    'body' => '<p>Hello {{ user_name }},</p><p>Your NA Innovations developer account has just been created.</p><ul><li>Login email: <strong>{{ email }}</strong></li><li>Developer portal: <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>You will receive a second email with a link to set your password. Once logged in, you\'ll see your assigned projects, log time entries, and track deliverables.</p><p>See you soon,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Developer welkom',
                    'subject' => 'Welkom bij NA Innovations — je developeraccount staat klaar',
                    'body' => '<p>Hallo {{ user_name }},</p><p>Je NA Innovations developeraccount is aangemaakt.</p><ul><li>Login e-mail: <strong>{{ email }}</strong></li><li>Developer portaal: <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>Je ontvangt een tweede e-mail met een link om je wachtwoord in te stellen. Eenmaal ingelogd zie je je toegewezen projecten, kun je uren loggen en deliverables opvolgen.</p><p>Tot snel,<br><strong>NA Innovations</strong></p>',
                ],
            ],
            // ════════════════════════════ ADMIN ════════════════════════════
            [
                'slug' => 'admin-welcome',
                'category' => 'onboarding',
                'variables' => ['user_name', 'email', 'portal_url'],
                'fr' => [
                    'name' => 'Bienvenue admin',
                    'subject' => 'Bienvenue chez NA Innovations — ton compte admin est prêt',
                    'body' => '<p>Bonjour {{ user_name }},</p><p>Ton compte administrateur NA Innovations vient d\'être créé.</p><ul><li>Email de connexion : <strong>{{ email }}</strong></li><li>Back-office : <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>Tu vas recevoir un second email avec un lien pour définir ton mot de passe. Tu auras alors ton propre espace admin (tes clients, projets, factures, partenaires) isolé des autres admins de la plateforme.</p><p>À bientôt,<br><strong>NA Innovations</strong></p>',
                ],
                'en' => [
                    'name' => 'Admin welcome',
                    'subject' => 'Welcome to NA Innovations — your admin account is ready',
                    'body' => '<p>Hello {{ user_name }},</p><p>Your NA Innovations admin account has just been created.</p><ul><li>Login email: <strong>{{ email }}</strong></li><li>Back-office: <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>You will receive a second email with a link to set your password. You will then have your own admin workspace (clients, projects, invoices, partners) isolated from other platform admins.</p><p>See you soon,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Admin welkom',
                    'subject' => 'Welkom bij NA Innovations — je adminaccount staat klaar',
                    'body' => '<p>Hallo {{ user_name }},</p><p>Je NA Innovations adminaccount is aangemaakt.</p><ul><li>Login e-mail: <strong>{{ email }}</strong></li><li>Back-office: <a href="{{ portal_url }}">{{ portal_url }}</a></li></ul><p>Je ontvangt een tweede e-mail met een link om je wachtwoord in te stellen. Je krijgt dan je eigen adminwerkruimte (klanten, projecten, facturen, partners), geïsoleerd van andere platform-admins.</p><p>Tot snel,<br><strong>NA Innovations</strong></p>',
                ],
            ],
        ];

        foreach ($templates as $tpl) {
            $vars = json_encode($tpl['variables']);
            foreach (['fr', 'en', 'nl'] as $locale) {
                $data = $tpl[$locale];
                DB::table('email_templates')->updateOrInsert(
                    ['slug' => $tpl['slug'], 'locale' => $locale],
                    [
                        'name' => $data['name'],
                        'subject' => $data['subject'],
                        'body' => $data['body'],
                        'available_variables' => $vars,
                        'category' => $tpl['category'],
                        'is_active' => true,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ],
                );
            }
        }
    }

    public function down(): void
    {
        DB::table('email_templates')
            ->whereIn('slug', ['partner-welcome', 'developer-welcome', 'admin-welcome'])
            ->delete();
    }
};
