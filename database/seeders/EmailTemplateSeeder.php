<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [

            // ═══════════════════════════════════════════════
            // PROSPECT → ADMIN
            // ═══════════════════════════════════════════════

            // #2 — Prospect receives confirmation after contact form
            [
                'slug' => 'contact-confirmation',
                'category' => 'lead',
                'variables' => ['client_name', 'client_email', 'service_interest'],
                'en' => [
                    'name' => 'Contact Form Confirmation',
                    'subject' => 'Thank you for contacting NA Innovations',
                    'body' => '<p>Dear {{ client_name }},</p><p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p><p>In the meantime, feel free to visit our website to learn more about our services.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Confirmation formulaire de contact',
                    'subject' => 'Merci de nous avoir contactés - NA Innovations',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Merci pour votre prise de contact. Nous avons bien reçu votre message et reviendrons vers vous dans les 24 heures.</p><p>En attendant, n\'hésitez pas à consulter notre site web pour découvrir nos services.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Bevestiging contactformulier',
                    'subject' => 'Bedankt voor uw bericht - NA Innovations',
                    'body' => '<p>Beste {{ client_name }},</p><p>Bedankt voor uw bericht. Wij hebben uw aanvraag ontvangen en nemen binnen 24 uur contact met u op.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // ═══════════════════════════════════════════════
            // ADMIN → CLIENT
            // ═══════════════════════════════════════════════

            // #3 — Quote sent to client (already exists, keep slug)
            [
                'slug' => 'quote-sent',
                'category' => 'quote',
                'variables' => ['client_name', 'quote_number', 'total', 'valid_until', 'view_url'],
                'en' => [
                    'name' => 'Quote Sent',
                    'subject' => 'Your quote #{{ quote_number }} from NA Innovations',
                    'body' => '<p>Dear {{ client_name }},</p><p>Please find attached your quote <strong>#{{ quote_number }}</strong> for a total of <strong>{{ total }}</strong>.</p><p>This quote is valid until <strong>{{ valid_until }}</strong>.</p><p>You can view and accept your quote directly from your client portal.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Devis envoyé',
                    'subject' => 'Votre devis #{{ quote_number }} de NA Innovations',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Veuillez trouver ci-joint votre devis <strong>#{{ quote_number }}</strong> pour un montant de <strong>{{ total }}</strong>.</p><p>Ce devis est valable jusqu\'au <strong>{{ valid_until }}</strong>.</p><p>Vous pouvez consulter et accepter votre devis directement depuis votre portail client.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Offerte verzonden',
                    'subject' => 'Uw offerte #{{ quote_number }} van NA Innovations',
                    'body' => '<p>Beste {{ client_name }},</p><p>Bijgevoegd vindt u uw offerte <strong>#{{ quote_number }}</strong> voor een bedrag van <strong>{{ total }}</strong>.</p><p>Deze offerte is geldig tot <strong>{{ valid_until }}</strong>.</p><p>U kunt uw offerte bekijken en accepteren via uw klantenportaal.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #4 — Invoice sent to client (already exists, keep slug)
            [
                'slug' => 'invoice-sent',
                'category' => 'invoice',
                'variables' => ['client_name', 'invoice_number', 'total', 'due_date', 'view_url'],
                'en' => [
                    'name' => 'Invoice Sent',
                    'subject' => 'Invoice #{{ invoice_number }} from NA Innovations',
                    'body' => '<p>Dear {{ client_name }},</p><p>Please find attached your invoice <strong>#{{ invoice_number }}</strong>.</p><p>Amount due: <strong>{{ total }} EUR</strong><br>Due date: <strong>{{ due_date }}</strong></p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Facture envoyée',
                    'subject' => 'Facture #{{ invoice_number }} de NA Innovations',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Veuillez trouver ci-joint votre facture <strong>#{{ invoice_number }}</strong>.</p><p>Montant dû : <strong>{{ total }} EUR</strong><br>Échéance : <strong>{{ due_date }}</strong></p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Factuur verzonden',
                    'subject' => 'Factuur #{{ invoice_number }} van NA Innovations',
                    'body' => '<p>Beste {{ client_name }},</p><p>Bijgevoegd vindt u uw factuur <strong>#{{ invoice_number }}</strong>.</p><p>Verschuldigd bedrag: <strong>{{ total }} EUR</strong><br>Vervaldatum: <strong>{{ due_date }}</strong></p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #5 — Client account created (manual)
            [
                'slug' => 'client-welcome',
                'category' => 'account',
                'variables' => ['client_name', 'email', 'portal_url'],
                'en' => [
                    'name' => 'Client Welcome',
                    'subject' => 'Your NA Innovations client portal is ready',
                    'body' => '<p>Dear {{ client_name }},</p><p>Your client portal account has been created.</p><p>You can access it at: <strong>{{ portal_url }}</strong><br>Email: <strong>{{ email }}</strong></p><p>Please click the link below to set your password and start tracking your project.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Bienvenue client',
                    'subject' => 'Votre portail client NA Innovations est prêt',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Votre compte client a été créé.</p><p>Vous pouvez y accéder à : <strong>{{ portal_url }}</strong><br>Email : <strong>{{ email }}</strong></p><p>Cliquez sur le lien ci-dessous pour définir votre mot de passe et commencer à suivre votre projet.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Welkom klant',
                    'subject' => 'Uw NA Innovations klantenportaal is klaar',
                    'body' => '<p>Beste {{ client_name }},</p><p>Uw klantenportaalaccount is aangemaakt.</p><p>U kunt het openen via: <strong>{{ portal_url }}</strong><br>E-mail: <strong>{{ email }}</strong></p><p>Klik op de onderstaande link om uw wachtwoord in te stellen en uw project te volgen.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #6 — Invoice overdue reminder
            [
                'slug' => 'invoice-overdue',
                'category' => 'invoice',
                'variables' => ['client_name', 'invoice_number', 'total', 'due_date', 'days_overdue'],
                'en' => [
                    'name' => 'Invoice Overdue Reminder',
                    'subject' => 'Reminder: Invoice #{{ invoice_number }} is overdue',
                    'body' => '<p>Dear {{ client_name }},</p><p>This is a reminder that invoice <strong>#{{ invoice_number }}</strong> for <strong>{{ total }} EUR</strong> was due on <strong>{{ due_date }}</strong> and is now <strong>{{ days_overdue }} days overdue</strong>.</p><p>Please arrange payment at your earliest convenience.</p><p>If you have already made the payment, please disregard this message.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Rappel facture en retard',
                    'subject' => 'Rappel : Facture #{{ invoice_number }} en retard',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Nous vous rappelons que la facture <strong>#{{ invoice_number }}</strong> de <strong>{{ total }} EUR</strong> était due le <strong>{{ due_date }}</strong> et a maintenant <strong>{{ days_overdue }} jours de retard</strong>.</p><p>Merci de procéder au paiement dans les meilleurs délais.</p><p>Si vous avez déjà effectué le paiement, veuillez ignorer ce message.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Herinnering achterstallige factuur',
                    'subject' => 'Herinnering: Factuur #{{ invoice_number }} is achterstallig',
                    'body' => '<p>Beste {{ client_name }},</p><p>Dit is een herinnering dat factuur <strong>#{{ invoice_number }}</strong> van <strong>{{ total }} EUR</strong> verviel op <strong>{{ due_date }}</strong> en nu <strong>{{ days_overdue }} dagen achterstallig</strong> is.</p><p>Gelieve zo spoedig mogelijk te betalen.</p><p>Als u de betaling reeds heeft uitgevoerd, kunt u dit bericht negeren.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #7 — Payment confirmation
            [
                'slug' => 'payment-confirmation',
                'category' => 'invoice',
                'variables' => ['client_name', 'invoice_number', 'amount', 'payment_date', 'remaining'],
                'en' => [
                    'name' => 'Payment Confirmation',
                    'subject' => 'Payment received for invoice #{{ invoice_number }}',
                    'body' => '<p>Dear {{ client_name }},</p><p>We confirm receipt of your payment of <strong>{{ amount }} EUR</strong> on <strong>{{ payment_date }}</strong> for invoice <strong>#{{ invoice_number }}</strong>.</p><p>Remaining balance: <strong>{{ remaining }} EUR</strong></p><p>Thank you for your prompt payment.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Confirmation de paiement',
                    'subject' => 'Paiement reçu pour la facture #{{ invoice_number }}',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Nous confirmons la réception de votre paiement de <strong>{{ amount }} EUR</strong> le <strong>{{ payment_date }}</strong> pour la facture <strong>#{{ invoice_number }}</strong>.</p><p>Solde restant : <strong>{{ remaining }} EUR</strong></p><p>Merci pour votre paiement.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Betalingsbevestiging',
                    'subject' => 'Betaling ontvangen voor factuur #{{ invoice_number }}',
                    'body' => '<p>Beste {{ client_name }},</p><p>Wij bevestigen de ontvangst van uw betaling van <strong>{{ amount }} EUR</strong> op <strong>{{ payment_date }}</strong> voor factuur <strong>#{{ invoice_number }}</strong>.</p><p>Resterend saldo: <strong>{{ remaining }} EUR</strong></p><p>Bedankt voor uw betaling.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #8 — Project status update
            [
                'slug' => 'project-status-update',
                'category' => 'project',
                'variables' => ['client_name', 'project_name', 'old_status', 'new_status', 'portal_url'],
                'en' => [
                    'name' => 'Project Status Update',
                    'subject' => 'Project update: {{ project_name }}',
                    'body' => '<p>Dear {{ client_name }},</p><p>Your project <strong>{{ project_name }}</strong> has been updated from <strong>{{ old_status }}</strong> to <strong>{{ new_status }}</strong>.</p><p>Log in to your portal to see the latest progress and timeline.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Mise à jour du projet',
                    'subject' => 'Mise à jour projet : {{ project_name }}',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Votre projet <strong>{{ project_name }}</strong> est passé de <strong>{{ old_status }}</strong> à <strong>{{ new_status }}</strong>.</p><p>Connectez-vous à votre portail pour voir les dernières avancées.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Project statusupdate',
                    'subject' => 'Projectupdate: {{ project_name }}',
                    'body' => '<p>Beste {{ client_name }},</p><p>Uw project <strong>{{ project_name }}</strong> is gewijzigd van <strong>{{ old_status }}</strong> naar <strong>{{ new_status }}</strong>.</p><p>Log in op uw portaal om de laatste voortgang te bekijken.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // #9 — Project completed
            [
                'slug' => 'project-completed',
                'category' => 'project',
                'variables' => ['client_name', 'project_name', 'portal_url'],
                'en' => [
                    'name' => 'Project Completed',
                    'subject' => 'Your project {{ project_name }} is ready!',
                    'body' => '<p>Dear {{ client_name }},</p><p>Great news! Your project <strong>{{ project_name }}</strong> has been completed.</p><p>Please log in to your client portal to review the final deliverables.</p><p>Thank you for trusting NA Innovations with your project.</p><p>Best regards,<br><strong>NA Innovations</strong></p>',
                ],
                'fr' => [
                    'name' => 'Projet terminé',
                    'subject' => 'Votre projet {{ project_name }} est prêt !',
                    'body' => '<p>Cher(e) {{ client_name }},</p><p>Bonne nouvelle ! Votre projet <strong>{{ project_name }}</strong> est terminé.</p><p>Connectez-vous à votre portail client pour consulter les livrables.</p><p>Merci de votre confiance.</p><p>Cordialement,<br><strong>NA Innovations</strong></p>',
                ],
                'nl' => [
                    'name' => 'Project voltooid',
                    'subject' => 'Uw project {{ project_name }} is klaar!',
                    'body' => '<p>Beste {{ client_name }},</p><p>Goed nieuws! Uw project <strong>{{ project_name }}</strong> is voltooid.</p><p>Log in op uw klantenportaal om de eindresultaten te bekijken.</p><p>Bedankt voor uw vertrouwen.</p><p>Met vriendelijke groeten,<br><strong>NA Innovations</strong></p>',
                ],
            ],

            // ═══════════════════════════════════════════════
            // CLIENT → ADMIN
            // ═══════════════════════════════════════════════

            // #10 — Client accepted quote → notify admin
            [
                'slug' => 'quote-accepted-admin',
                'category' => 'quote',
                'variables' => ['client_name', 'quote_number', 'total', 'project_name'],
                'en' => ['name' => 'Quote Accepted (Admin)', 'subject' => 'Quote #{{ quote_number }} accepted by {{ client_name }}', 'body' => '<p>{{ client_name }} has accepted quote <strong>#{{ quote_number }}</strong> ({{ total }}).</p><p>Workflow triggered: client created, project initialized, deposit invoice generated.</p>'],
                'fr' => ['name' => 'Devis accepté (Admin)', 'subject' => 'Devis #{{ quote_number }} accepté par {{ client_name }}', 'body' => '<p>{{ client_name }} a accepté le devis <strong>#{{ quote_number }}</strong> ({{ total }}).</p><p>Workflow déclenché : client créé, projet initialisé, facture d\'acompte générée.</p>'],
                'nl' => ['name' => 'Offerte geaccepteerd (Admin)', 'subject' => 'Offerte #{{ quote_number }} geaccepteerd door {{ client_name }}', 'body' => '<p>{{ client_name }} heeft offerte <strong>#{{ quote_number }}</strong> ({{ total }}) geaccepteerd.</p><p>Workflow gestart: klant aangemaakt, project geïnitialiseerd, voorschotfactuur gegenereerd.</p>'],
            ],

            // #11 — Client rejected quote → notify admin
            [
                'slug' => 'quote-rejected-admin',
                'category' => 'quote',
                'variables' => ['client_name', 'quote_number', 'reason'],
                'en' => ['name' => 'Quote Rejected (Admin)', 'subject' => 'Quote #{{ quote_number }} rejected by {{ client_name }}', 'body' => '<p>{{ client_name }} has rejected quote <strong>#{{ quote_number }}</strong>.</p><p>Reason: {{ reason }}</p>'],
                'fr' => ['name' => 'Devis refusé (Admin)', 'subject' => 'Devis #{{ quote_number }} refusé par {{ client_name }}', 'body' => '<p>{{ client_name }} a refusé le devis <strong>#{{ quote_number }}</strong>.</p><p>Raison : {{ reason }}</p>'],
                'nl' => ['name' => 'Offerte afgewezen (Admin)', 'subject' => 'Offerte #{{ quote_number }} afgewezen door {{ client_name }}', 'body' => '<p>{{ client_name }} heeft offerte <strong>#{{ quote_number }}</strong> afgewezen.</p><p>Reden: {{ reason }}</p>'],
            ],

            // #12 — Client comment → notify admin+dev
            [
                'slug' => 'client-comment',
                'category' => 'project',
                'variables' => ['client_name', 'project_name', 'comment', 'portal_url'],
                'en' => ['name' => 'Client Comment', 'subject' => 'New comment on {{ project_name }} from {{ client_name }}', 'body' => '<p><strong>{{ client_name }}</strong> left a comment on project <strong>{{ project_name }}</strong>:</p><blockquote>{{ comment }}</blockquote>'],
                'fr' => ['name' => 'Commentaire client', 'subject' => 'Nouveau commentaire sur {{ project_name }} de {{ client_name }}', 'body' => '<p><strong>{{ client_name }}</strong> a laissé un commentaire sur le projet <strong>{{ project_name }}</strong> :</p><blockquote>{{ comment }}</blockquote>'],
                'nl' => ['name' => 'Klantcommentaar', 'subject' => 'Nieuw commentaar op {{ project_name }} van {{ client_name }}', 'body' => '<p><strong>{{ client_name }}</strong> heeft een opmerking achtergelaten op project <strong>{{ project_name }}</strong>:</p><blockquote>{{ comment }}</blockquote>'],
            ],

            // #13 — Client viewed quote → notify admin
            [
                'slug' => 'quote-viewed-admin',
                'category' => 'quote',
                'variables' => ['client_name', 'quote_number'],
                'en' => ['name' => 'Quote Viewed (Admin)', 'subject' => '{{ client_name }} opened quote #{{ quote_number }}', 'body' => '<p>{{ client_name }} has viewed quote <strong>#{{ quote_number }}</strong>. Follow up if no response within a few days.</p>'],
                'fr' => ['name' => 'Devis consulté (Admin)', 'subject' => '{{ client_name }} a ouvert le devis #{{ quote_number }}', 'body' => '<p>{{ client_name }} a consulté le devis <strong>#{{ quote_number }}</strong>. Relancez si pas de réponse dans quelques jours.</p>'],
                'nl' => ['name' => 'Offerte bekeken (Admin)', 'subject' => '{{ client_name }} heeft offerte #{{ quote_number }} geopend', 'body' => '<p>{{ client_name }} heeft offerte <strong>#{{ quote_number }}</strong> bekeken. Volg op als er geen reactie komt binnen enkele dagen.</p>'],
            ],

            // ═══════════════════════════════════════════════
            // PARTENAIRE
            // ═══════════════════════════════════════════════

            // #14 — Partner outreach to prospect
            [
                'slug' => 'partner-lead-outreach',
                'category' => 'lead',
                'variables' => ['client_name', 'client_email', 'partner_name', 'company_name', 'service_interest', 'estimated_budget'],
                'en' => ['name' => 'Partner Lead Outreach', 'subject' => 'NA Innovations - We would love to help you with your project', 'body' => '<p>Dear {{ client_name }},</p><p>My name is {{ partner_name }} and I am reaching out on behalf of <strong>NA Innovations</strong>, a web and mobile development agency.</p><p>We would love to learn more about your project needs and see how we can help.</p><p>Best regards,<br>{{ partner_name }}<br><em>on behalf of NA Innovations</em></p>'],
                'fr' => ['name' => 'Démarchage partenaire', 'subject' => 'NA Innovations - Nous serions ravis de vous accompagner', 'body' => '<p>Cher(e) {{ client_name }},</p><p>Je me permets de vous contacter au nom de <strong>NA Innovations</strong>, une agence de développement web et mobile.</p><p>Nous serions ravis d\'en savoir plus sur vos besoins et de voir comment nous pouvons vous aider.</p><p>Cordialement,<br>{{ partner_name }}<br><em>pour NA Innovations</em></p>'],
                'nl' => ['name' => 'Partner outreach', 'subject' => 'NA Innovations - Wij helpen u graag met uw project', 'body' => '<p>Beste {{ client_name }},</p><p>Ik neem contact met u op namens <strong>NA Innovations</strong>, een web- en mobiel ontwikkelingsbureau.</p><p>Wij zouden graag meer willen weten over uw projectbehoeften.</p><p>Met vriendelijke groeten,<br>{{ partner_name }}<br><em>namens NA Innovations</em></p>'],
            ],

            // #15 — Partner submits lead → notify admin
            [
                'slug' => 'new-lead-admin',
                'category' => 'lead',
                'variables' => ['partner_name', 'client_name', 'client_email', 'service_interest', 'estimated_budget'],
                'en' => ['name' => 'New Lead (Admin)', 'subject' => 'New lead from {{ partner_name }}: {{ client_name }}', 'body' => '<p>A new lead has been submitted by partner <strong>{{ partner_name }}</strong>.</p><p>Client: <strong>{{ client_name }}</strong> ({{ client_email }})<br>Interest: {{ service_interest }}<br>Budget: {{ estimated_budget }}</p>'],
                'fr' => ['name' => 'Nouveau lead (Admin)', 'subject' => 'Nouveau lead de {{ partner_name }} : {{ client_name }}', 'body' => '<p>Un nouveau lead a été soumis par le partenaire <strong>{{ partner_name }}</strong>.</p><p>Client : <strong>{{ client_name }}</strong> ({{ client_email }})<br>Intérêt : {{ service_interest }}<br>Budget : {{ estimated_budget }}</p>'],
                'nl' => ['name' => 'Nieuwe lead (Admin)', 'subject' => 'Nieuwe lead van {{ partner_name }}: {{ client_name }}', 'body' => '<p>Een nieuwe lead is ingediend door partner <strong>{{ partner_name }}</strong>.</p><p>Klant: <strong>{{ client_name }}</strong> ({{ client_email }})<br>Interesse: {{ service_interest }}<br>Budget: {{ estimated_budget }}</p>'],
            ],

            // #16 — Lead won → notify partner
            [
                'slug' => 'lead-won-partner',
                'category' => 'commission',
                'variables' => ['partner_name', 'client_name', 'project_name', 'commission_rate'],
                'en' => ['name' => 'Lead Won (Partner)', 'subject' => 'Great news! Your referral {{ client_name }} has signed', 'body' => '<p>Dear {{ partner_name }},</p><p>Your referral <strong>{{ client_name }}</strong> has accepted our quote and the project <strong>{{ project_name }}</strong> has been initiated.</p><p>Your commission rate: <strong>{{ commission_rate }}%</strong></p><p>You will receive your commission once payments are processed.</p><p>Thank you!<br><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Lead gagné (Partenaire)', 'subject' => 'Bonne nouvelle ! Votre référence {{ client_name }} a signé', 'body' => '<p>Cher(e) {{ partner_name }},</p><p>Votre référence <strong>{{ client_name }}</strong> a accepté notre devis et le projet <strong>{{ project_name }}</strong> a été lancé.</p><p>Votre taux de commission : <strong>{{ commission_rate }}%</strong></p><p>Vous recevrez votre commission une fois les paiements traités.</p><p>Merci !<br><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Lead gewonnen (Partner)', 'subject' => 'Goed nieuws! Uw verwijzing {{ client_name }} heeft getekend', 'body' => '<p>Beste {{ partner_name }},</p><p>Uw verwijzing <strong>{{ client_name }}</strong> heeft onze offerte geaccepteerd en het project <strong>{{ project_name }}</strong> is gestart.</p><p>Uw commissietarief: <strong>{{ commission_rate }}%</strong></p><p>U ontvangt uw commissie zodra de betalingen zijn verwerkt.</p><p>Bedankt!<br><strong>NA Innovations</strong></p>'],
            ],

            // #17 — Commission earned → notify partner
            [
                'slug' => 'commission-earned',
                'category' => 'commission',
                'variables' => ['partner_name', 'client_name', 'commission_amount', 'invoice_number'],
                'en' => ['name' => 'Commission Earned', 'subject' => 'Commission earned: {{ commission_amount }} EUR', 'body' => '<p>Dear {{ partner_name }},</p><p>You have earned a commission of <strong>{{ commission_amount }} EUR</strong> from a payment on invoice <strong>#{{ invoice_number }}</strong> (client: {{ client_name }}).</p><p>View your commissions in the partner portal for details.</p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Commission gagnée', 'subject' => 'Commission gagnée : {{ commission_amount }} EUR', 'body' => '<p>Cher(e) {{ partner_name }},</p><p>Vous avez gagné une commission de <strong>{{ commission_amount }} EUR</strong> suite à un paiement sur la facture <strong>#{{ invoice_number }}</strong> (client : {{ client_name }}).</p><p>Consultez vos commissions dans le portail partenaire.</p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Commissie verdiend', 'subject' => 'Commissie verdiend: {{ commission_amount }} EUR', 'body' => '<p>Beste {{ partner_name }},</p><p>U heeft een commissie verdiend van <strong>{{ commission_amount }} EUR</strong> op een betaling voor factuur <strong>#{{ invoice_number }}</strong> (klant: {{ client_name }}).</p><p>Bekijk uw commissies in het partnerportaal.</p><p><strong>NA Innovations</strong></p>'],
            ],

            // #20 — Commission paid → notify partner
            [
                'slug' => 'commission-paid',
                'category' => 'commission',
                'variables' => ['partner_name', 'commission_amount', 'payment_reference'],
                'en' => ['name' => 'Commission Paid', 'subject' => 'Commission payment: {{ commission_amount }} EUR', 'body' => '<p>Dear {{ partner_name }},</p><p>Your commission of <strong>{{ commission_amount }} EUR</strong> has been paid.</p><p>Reference: <strong>{{ payment_reference }}</strong></p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Commission payée', 'subject' => 'Paiement commission : {{ commission_amount }} EUR', 'body' => '<p>Cher(e) {{ partner_name }},</p><p>Votre commission de <strong>{{ commission_amount }} EUR</strong> a été payée.</p><p>Référence : <strong>{{ payment_reference }}</strong></p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Commissie betaald', 'subject' => 'Commissiebetaling: {{ commission_amount }} EUR', 'body' => '<p>Beste {{ partner_name }},</p><p>Uw commissie van <strong>{{ commission_amount }} EUR</strong> is betaald.</p><p>Referentie: <strong>{{ payment_reference }}</strong></p><p><strong>NA Innovations</strong></p>'],
            ],

            // ═══════════════════════════════════════════════
            // DEV
            // ═══════════════════════════════════════════════

            // #21 — Dev claims project → notify admin
            [
                'slug' => 'project-claimed-admin',
                'category' => 'project',
                'variables' => ['dev_name', 'project_name'],
                'en' => ['name' => 'Project Claimed (Admin)', 'subject' => '{{ dev_name }} claimed project {{ project_name }}', 'body' => '<p>Developer <strong>{{ dev_name }}</strong> has claimed project <strong>{{ project_name }}</strong>.</p>'],
                'fr' => ['name' => 'Projet réclamé (Admin)', 'subject' => '{{ dev_name }} a réclamé le projet {{ project_name }}', 'body' => '<p>Le développeur <strong>{{ dev_name }}</strong> a réclamé le projet <strong>{{ project_name }}</strong>.</p>'],
                'nl' => ['name' => 'Project geclaimd (Admin)', 'subject' => '{{ dev_name }} heeft project {{ project_name }} geclaimd', 'body' => '<p>Ontwikkelaar <strong>{{ dev_name }}</strong> heeft project <strong>{{ project_name }}</strong> geclaimd.</p>'],
            ],

            // #22 — Admin assigns project to dev
            [
                'slug' => 'project-assigned-dev',
                'category' => 'project',
                'variables' => ['dev_name', 'project_name', 'client_name', 'deadline'],
                'en' => ['name' => 'Project Assigned (Dev)', 'subject' => 'New project assigned: {{ project_name }}', 'body' => '<p>Dear {{ dev_name }},</p><p>You have been assigned to project <strong>{{ project_name }}</strong> (client: {{ client_name }}).</p><p>Deadline: <strong>{{ deadline }}</strong></p><p>Check your developer portal for details.</p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Projet assigné (Dev)', 'subject' => 'Nouveau projet assigné : {{ project_name }}', 'body' => '<p>Cher(e) {{ dev_name }},</p><p>Vous avez été assigné(e) au projet <strong>{{ project_name }}</strong> (client : {{ client_name }}).</p><p>Échéance : <strong>{{ deadline }}</strong></p><p>Consultez votre portail développeur.</p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Project toegewezen (Dev)', 'subject' => 'Nieuw project toegewezen: {{ project_name }}', 'body' => '<p>Beste {{ dev_name }},</p><p>U bent toegewezen aan project <strong>{{ project_name }}</strong> (klant: {{ client_name }}).</p><p>Deadline: <strong>{{ deadline }}</strong></p><p>Bekijk uw ontwikkelaarsportaal voor details.</p><p><strong>NA Innovations</strong></p>'],
            ],

            // ═══════════════════════════════════════════════
            // SERVICES
            // ═══════════════════════════════════════════════

            // #25-28 — Service expiry alert (generic for all tiers)
            [
                'slug' => 'service-expiry-alert',
                'category' => 'service',
                'variables' => ['service_name', 'provider', 'expiry_date', 'days_left', 'project_name', 'auto_renew'],
                'en' => ['name' => 'Service Expiry Alert', 'subject' => 'Service alert: {{ service_name }} expires in {{ days_left }} days', 'body' => '<p>Service <strong>{{ service_name }}</strong> ({{ provider }}) for project <strong>{{ project_name }}</strong> expires on <strong>{{ expiry_date }}</strong> ({{ days_left }} days).</p><p>Auto-renew: <strong>{{ auto_renew }}</strong></p>'],
                'fr' => ['name' => 'Alerte expiration service', 'subject' => 'Alerte service : {{ service_name }} expire dans {{ days_left }} jours', 'body' => '<p>Le service <strong>{{ service_name }}</strong> ({{ provider }}) pour le projet <strong>{{ project_name }}</strong> expire le <strong>{{ expiry_date }}</strong> ({{ days_left }} jours).</p><p>Renouvellement auto : <strong>{{ auto_renew }}</strong></p>'],
                'nl' => ['name' => 'Service vervalmelding', 'subject' => 'Servicemelding: {{ service_name }} verloopt over {{ days_left }} dagen', 'body' => '<p>Service <strong>{{ service_name }}</strong> ({{ provider }}) voor project <strong>{{ project_name }}</strong> verloopt op <strong>{{ expiry_date }}</strong> ({{ days_left }} dagen).</p><p>Automatische verlenging: <strong>{{ auto_renew }}</strong></p>'],
            ],

            // #29 — Service renewed
            [
                'slug' => 'service-renewed',
                'category' => 'service',
                'variables' => ['service_name', 'provider', 'new_expiry_date', 'cost', 'project_name'],
                'en' => ['name' => 'Service Renewed', 'subject' => 'Service renewed: {{ service_name }}', 'body' => '<p>Service <strong>{{ service_name }}</strong> ({{ provider }}) for project <strong>{{ project_name }}</strong> has been automatically renewed until <strong>{{ new_expiry_date }}</strong>.</p><p>Cost: <strong>{{ cost }} EUR</strong></p>'],
                'fr' => ['name' => 'Service renouvelé', 'subject' => 'Service renouvelé : {{ service_name }}', 'body' => '<p>Le service <strong>{{ service_name }}</strong> ({{ provider }}) pour le projet <strong>{{ project_name }}</strong> a été automatiquement renouvelé jusqu\'au <strong>{{ new_expiry_date }}</strong>.</p><p>Coût : <strong>{{ cost }} EUR</strong></p>'],
                'nl' => ['name' => 'Service verlengd', 'subject' => 'Service verlengd: {{ service_name }}', 'body' => '<p>Service <strong>{{ service_name }}</strong> ({{ provider }}) voor project <strong>{{ project_name }}</strong> is automatisch verlengd tot <strong>{{ new_expiry_date }}</strong>.</p><p>Kosten: <strong>{{ cost }} EUR</strong></p>'],
            ],

            // ═══════════════════════════════════════════════
            // INSCRIPTION / ACCOUNTS
            // ═══════════════════════════════════════════════

            // #33 — Quote expiring soon → client
            [
                'slug' => 'quote-expiring',
                'category' => 'quote',
                'variables' => ['client_name', 'quote_number', 'valid_until', 'total'],
                'en' => ['name' => 'Quote Expiring Soon', 'subject' => 'Your quote #{{ quote_number }} expires soon', 'body' => '<p>Dear {{ client_name }},</p><p>Your quote <strong>#{{ quote_number }}</strong> ({{ total }}) expires on <strong>{{ valid_until }}</strong>.</p><p>Please accept or contact us before the expiry date.</p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Devis bientôt expiré', 'subject' => 'Votre devis #{{ quote_number }} expire bientôt', 'body' => '<p>Cher(e) {{ client_name }},</p><p>Votre devis <strong>#{{ quote_number }}</strong> ({{ total }}) expire le <strong>{{ valid_until }}</strong>.</p><p>Veuillez accepter ou nous contacter avant la date d\'expiration.</p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Offerte verloopt binnenkort', 'subject' => 'Uw offerte #{{ quote_number }} verloopt binnenkort', 'body' => '<p>Beste {{ client_name }},</p><p>Uw offerte <strong>#{{ quote_number }}</strong> ({{ total }}) verloopt op <strong>{{ valid_until }}</strong>.</p><p>Gelieve te accepteren of contact met ons op te nemen voor de vervaldatum.</p><p><strong>NA Innovations</strong></p>'],
            ],

            // #34 — Registration → notify admin
            [
                'slug' => 'registration-pending-admin',
                'category' => 'account',
                'variables' => ['user_name', 'user_email', 'role'],
                'en' => ['name' => 'New Registration (Admin)', 'subject' => 'New registration pending: {{ user_name }}', 'body' => '<p>A new <strong>{{ role }}</strong> registration requires your approval.</p><p>Name: <strong>{{ user_name }}</strong><br>Email: <strong>{{ user_email }}</strong></p><p>Go to Team Management to approve or reject.</p>'],
                'fr' => ['name' => 'Nouvelle inscription (Admin)', 'subject' => 'Nouvelle inscription en attente : {{ user_name }}', 'body' => '<p>Une nouvelle inscription <strong>{{ role }}</strong> attend votre approbation.</p><p>Nom : <strong>{{ user_name }}</strong><br>Email : <strong>{{ user_email }}</strong></p><p>Allez dans Gestion d\'équipe pour approuver ou rejeter.</p>'],
                'nl' => ['name' => 'Nieuwe registratie (Admin)', 'subject' => 'Nieuwe registratie in afwachting: {{ user_name }}', 'body' => '<p>Een nieuwe <strong>{{ role }}</strong> registratie wacht op uw goedkeuring.</p><p>Naam: <strong>{{ user_name }}</strong><br>E-mail: <strong>{{ user_email }}</strong></p><p>Ga naar Teambeheer om goed te keuren of af te wijzen.</p>'],
            ],

            // #35 — Account approved
            [
                'slug' => 'account-approved',
                'category' => 'account',
                'variables' => ['user_name', 'portal_url'],
                'en' => ['name' => 'Account Approved', 'subject' => 'Your NA Innovations account has been approved', 'body' => '<p>Dear {{ user_name }},</p><p>Your account has been approved. You can now log in to your portal.</p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Compte approuvé', 'subject' => 'Votre compte NA Innovations a été approuvé', 'body' => '<p>Cher(e) {{ user_name }},</p><p>Votre compte a été approuvé. Vous pouvez maintenant vous connecter à votre portail.</p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Account goedgekeurd', 'subject' => 'Uw NA Innovations account is goedgekeurd', 'body' => '<p>Beste {{ user_name }},</p><p>Uw account is goedgekeurd. U kunt nu inloggen op uw portaal.</p><p><strong>NA Innovations</strong></p>'],
            ],

            // #36 — Account rejected
            [
                'slug' => 'account-rejected',
                'category' => 'account',
                'variables' => ['user_name'],
                'en' => ['name' => 'Account Rejected', 'subject' => 'Your NA Innovations registration', 'body' => '<p>Dear {{ user_name }},</p><p>Unfortunately, your registration request has not been approved at this time.</p><p>If you believe this is an error, please contact us.</p><p><strong>NA Innovations</strong></p>'],
                'fr' => ['name' => 'Compte refusé', 'subject' => 'Votre inscription NA Innovations', 'body' => '<p>Cher(e) {{ user_name }},</p><p>Votre demande d\'inscription n\'a malheureusement pas été approuvée.</p><p>Si vous pensez qu\'il s\'agit d\'une erreur, contactez-nous.</p><p><strong>NA Innovations</strong></p>'],
                'nl' => ['name' => 'Account afgewezen', 'subject' => 'Uw NA Innovations registratie', 'body' => '<p>Beste {{ user_name }},</p><p>Helaas is uw registratieverzoek niet goedgekeurd.</p><p>Als u denkt dat dit een vergissing is, neem dan contact met ons op.</p><p><strong>NA Innovations</strong></p>'],
            ],
        ];

        $count = 0;
        foreach ($templates as $tpl) {
            $vars = json_encode($tpl['variables']);
            foreach (['en', 'fr', 'nl'] as $locale) {
                if (!isset($tpl[$locale])) continue;
                EmailTemplate::updateOrCreate(
                    ['slug' => $tpl['slug'], 'locale' => $locale],
                    array_merge($tpl[$locale], [
                        'slug' => $tpl['slug'],
                        'locale' => $locale,
                        'category' => $tpl['category'],
                        'available_variables' => $vars,
                        'is_active' => true,
                    ])
                );
                $count++;
            }
        }

        echo "{$count} email templates seeded.\n";
    }
}
