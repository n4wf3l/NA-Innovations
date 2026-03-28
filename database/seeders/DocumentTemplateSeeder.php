<?php

namespace Database\Seeders;

use App\Models\DocumentTemplate;
use Illuminate\Database\Seeder;

class DocumentTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // ═══════════════════════════════════════════════════════
        // Template 1 — Accord de confidentialité (NDA)
        // ═══════════════════════════════════════════════════════

        DocumentTemplate::updateOrCreate(
            ['slug' => 'nda'],
            [
                'name' => 'Accord de confidentialité (NDA)',
                'category' => 'legal',
                'requires_signature' => true,
                'is_active' => true,
                'sort_order' => 1,
                'default_locale' => 'fr',
                'available_variables' => [
                    'client_name',
                    'client_company',
                    'agency_name',
                    'project_name',
                    'date',
                    'duration_months',
                    'jurisdiction',
                ],
                'body' => <<<'HTML'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Accord de confidentialité</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">Non-Disclosure Agreement (NDA)</p>

    <p style="margin-bottom: 20px;">
        Établi le <strong>{{ date }}</strong>, entre les parties suivantes :
    </p>

    <p style="margin-bottom: 10px;">
        <strong>Partie divulgatrice :</strong> {{ agency_name }}, ci-après dénommée « la Partie divulgatrice »,
    </p>
    <p style="margin-bottom: 30px;">
        <strong>Partie réceptrice :</strong> {{ client_name }}, agissant pour le compte de {{ client_company }}, ci-après dénommée « la Partie réceptrice ».
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 1 — Objet</h3>
    <p style="margin-bottom: 20px;">
        Le présent accord a pour objet de définir les conditions dans lesquelles les parties s'engagent
        à protéger les informations confidentielles échangées dans le cadre du projet
        <strong>{{ project_name }}</strong>. Sont considérées comme confidentielles toutes les informations
        techniques, commerciales, financières ou stratégiques communiquées par l'une des parties à l'autre,
        sous quelque forme que ce soit (écrite, orale, électronique ou visuelle).
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 2 — Durée</h3>
    <p style="margin-bottom: 20px;">
        Les obligations de confidentialité prévues par le présent accord sont en vigueur pour une durée de
        <strong>{{ duration_months }} mois</strong> à compter de la date de signature. À l'expiration de
        cette période, les parties restent tenues de ne pas divulguer les informations confidentielles
        reçues pendant la durée de l'accord.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 3 — Obligations des parties</h3>
    <p style="margin-bottom: 10px;">Chaque partie s'engage à :</p>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Ne pas divulguer, publier ou transmettre les informations confidentielles à des tiers sans l'accord écrit préalable de l'autre partie ;</li>
        <li style="margin-bottom: 8px;">Prendre toutes les mesures raisonnables pour protéger la confidentialité des informations reçues, avec un niveau de protection au moins équivalent à celui appliqué à ses propres informations confidentielles ;</li>
        <li style="margin-bottom: 8px;">Limiter l'accès aux informations confidentielles aux seuls collaborateurs ayant un besoin légitime d'en prendre connaissance dans le cadre du projet ;</li>
        <li style="margin-bottom: 8px;">Restituer ou détruire l'ensemble des documents et supports contenant des informations confidentielles à la première demande de l'autre partie ou à l'expiration du présent accord ;</li>
        <li style="margin-bottom: 8px;">Informer immédiatement l'autre partie en cas de divulgation accidentelle ou non autorisée d'informations confidentielles.</li>
    </ul>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 4 — Exclusions</h3>
    <p style="margin-bottom: 20px;">
        Ne sont pas considérées comme confidentielles les informations qui : (a) étaient déjà dans le domaine
        public au moment de leur communication ; (b) sont devenues publiques sans faute de la partie réceptrice ;
        (c) étaient déjà en possession légitime de la partie réceptrice avant leur communication ;
        (d) doivent être divulguées en vertu d'une obligation légale ou réglementaire.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 5 — Juridiction</h3>
    <p style="margin-bottom: 30px;">
        Le présent accord est régi par le droit applicable en <strong>{{ jurisdiction }}</strong>.
        Tout litige relatif à l'interprétation ou à l'exécution du présent accord sera soumis
        aux tribunaux compétents de <strong>{{ jurisdiction }}</strong>.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Pour {{ agency_name }}</p>
            <p style="margin-bottom: 4px;">Nom : ___________________________</p>
            <p style="margin-bottom: 4px;">Fonction : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Pour {{ client_company }}</p>
            <p style="margin-bottom: 4px;">Nom : {{ client_name }}</p>
            <p style="margin-bottom: 4px;">Fonction : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
    </div>

</div>
HTML,
            ]
        );

        // ═══════════════════════════════════════════════════════
        // Template 2 — Contrat de prestation de services
        // ═══════════════════════════════════════════════════════

        DocumentTemplate::updateOrCreate(
            ['slug' => 'service-contract'],
            [
                'name' => 'Contrat de prestation de services',
                'category' => 'legal',
                'requires_signature' => true,
                'is_active' => true,
                'sort_order' => 2,
                'default_locale' => 'fr',
                'available_variables' => [
                    'client_name',
                    'client_company',
                    'agency_name',
                    'project_name',
                    'scope',
                    'budget',
                    'timeline',
                    'payment_terms',
                    'date',
                ],
                'body' => <<<'HTML'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Contrat de prestation de services</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">Service Agreement</p>

    <p style="margin-bottom: 20px;">
        Établi le <strong>{{ date }}</strong>, entre les parties suivantes :
    </p>

    <p style="margin-bottom: 10px;">
        <strong>Le prestataire :</strong> {{ agency_name }}, ci-après dénommé « le Prestataire »,
    </p>
    <p style="margin-bottom: 30px;">
        <strong>Le client :</strong> {{ client_name }}, agissant pour le compte de {{ client_company }}, ci-après dénommé « le Client ».
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 1 — Objet du contrat</h3>
    <p style="margin-bottom: 20px;">
        Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire s'engage
        à réaliser pour le Client les prestations de services suivantes dans le cadre du projet
        <strong>{{ project_name }}</strong> :
    </p>
    <div style="background: #f9f9f9; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        {{ scope }}
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 2 — Livrables et délais</h3>
    <p style="margin-bottom: 20px;">
        Le Prestataire s'engage à livrer les résultats des prestations conformément au calendrier suivant :
    </p>
    <div style="background: #f9f9f9; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        {{ timeline }}
    </div>
    <p style="margin-bottom: 20px;">
        Tout retard dans la livraison devra être notifié par le Prestataire dans les meilleurs délais.
        Les parties conviendront alors d'un nouveau calendrier de livraison par accord mutuel.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 3 — Prix et modalités de paiement</h3>
    <p style="margin-bottom: 10px;">
        En contrepartie des prestations réalisées, le Client s'engage à verser au Prestataire la somme de :
    </p>
    <p style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 10px; color: #111;">
        {{ budget }}
    </p>
    <p style="margin-bottom: 10px;">Les modalités de paiement sont les suivantes :</p>
    <div style="background: #f9f9f9; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        {{ payment_terms }}
    </div>
    <p style="margin-bottom: 20px;">
        En cas de retard de paiement, des intérêts de retard seront appliqués au taux légal en vigueur,
        sans qu'un rappel préalable ne soit nécessaire. Le Prestataire se réserve le droit de suspendre
        les prestations en cas de non-paiement supérieur à 30 jours.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 4 — Propriété intellectuelle</h3>
    <p style="margin-bottom: 20px;">
        Tous les droits de propriété intellectuelle relatifs aux livrables développés dans le cadre du
        présent contrat seront transférés au Client après paiement intégral de l'ensemble des sommes dues.
        Jusqu'au paiement complet, le Prestataire conserve l'intégralité des droits de propriété
        intellectuelle sur les livrables. Le Prestataire se réserve le droit d'utiliser les techniques,
        méthodologies et savoir-faire généraux acquis ou développés lors de l'exécution du contrat.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 5 — Résiliation</h3>
    <p style="margin-bottom: 10px;">Le présent contrat peut être résilié dans les cas suivants :</p>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Par accord mutuel des parties, à tout moment, par notification écrite ;</li>
        <li style="margin-bottom: 8px;">Par l'une des parties en cas de manquement grave de l'autre partie à ses obligations contractuelles, après mise en demeure restée infructueuse pendant 15 jours ;</li>
        <li style="margin-bottom: 8px;">Par le Client, avec un préavis de 30 jours, sous réserve du paiement des prestations déjà réalisées et des frais engagés par le Prestataire.</li>
    </ul>
    <p style="margin-bottom: 20px;">
        En cas de résiliation anticipée, les sommes correspondant aux prestations déjà exécutées
        restent acquises au Prestataire.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 6 — Juridiction et droit applicable</h3>
    <p style="margin-bottom: 30px;">
        Le présent contrat est régi par le droit belge. Tout litige relatif à l'interprétation,
        l'exécution ou la résiliation du présent contrat sera soumis aux tribunaux compétents
        de Bruxelles, Belgique.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="margin-bottom: 20px; font-style: italic; color: #666;">
        Fait en deux exemplaires originaux, chaque partie reconnaissant avoir reçu le sien.
    </p>

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Prestataire — {{ agency_name }}</p>
            <p style="margin-bottom: 4px;">Nom : ___________________________</p>
            <p style="margin-bottom: 4px;">Fonction : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Client — {{ client_company }}</p>
            <p style="margin-bottom: 4px;">Nom : {{ client_name }}</p>
            <p style="margin-bottom: 4px;">Fonction : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
    </div>

</div>
HTML,
            ]
        );

        // ═══════════════════════════════════════════════════════
        // Template 3 — Procès-verbal de réception
        // ═══════════════════════════════════════════════════════

        DocumentTemplate::updateOrCreate(
            ['slug' => 'delivery-report'],
            [
                'name' => 'Procès-verbal de réception',
                'category' => 'delivery',
                'requires_signature' => true,
                'is_active' => true,
                'sort_order' => 3,
                'default_locale' => 'fr',
                'available_variables' => [
                    'client_name',
                    'client_company',
                    'project_name',
                    'delivery_date',
                    'deliverables',
                    'remarks',
                ],
                'body' => <<<'HTML'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Procès-verbal de réception</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">Delivery Acceptance Report</p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Informations générales</h3>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
            <td style="padding: 10px 16px; background: #f3f4f6; font-weight: bold; width: 35%; border: 1px solid #e5e7eb;">Projet</td>
            <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">{{ project_name }}</td>
        </tr>
        <tr>
            <td style="padding: 10px 16px; background: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Client</td>
            <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">{{ client_name }} — {{ client_company }}</td>
        </tr>
        <tr>
            <td style="padding: 10px 16px; background: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Date de livraison</td>
            <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">{{ delivery_date }}</td>
        </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">Livrables réceptionnés</h3>
    <p style="margin-bottom: 10px;">
        Les éléments suivants ont été livrés et présentés au Client dans le cadre du projet
        <strong>{{ project_name }}</strong> :
    </p>
    <div style="background: #f9f9f9; border-left: 3px solid #10b981; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
        {{ deliverables }}
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Déclaration de réception</h3>
    <p style="margin-bottom: 20px;">
        Par la signature du présent procès-verbal, le Client reconnaît avoir reçu et examiné
        l'ensemble des livrables énumérés ci-dessus. Le Client déclare que les livrables sont
        conformes aux spécifications convenues et accepte formellement la livraison réalisée
        à la date du <strong>{{ delivery_date }}</strong>.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Réserves et remarques</h3>
    <p style="margin-bottom: 10px;">
        Le Client formule les réserves ou remarques suivantes concernant les livrables réceptionnés :
    </p>
    <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 16px; margin-bottom: 20px; border-radius: 4px; min-height: 60px;">
        {{ remarks }}
    </div>
    <p style="margin-bottom: 30px; font-style: italic; color: #666;">
        En l'absence de réserves, la réception est considérée comme définitive et sans restriction.
        Si des réserves sont formulées, le Prestataire s'engage à les traiter dans un délai convenu
        entre les parties.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Prestataire</p>
            <p style="margin-bottom: 4px;">Nom : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Client — {{ client_company }}</p>
            <p style="margin-bottom: 4px;">Nom : {{ client_name }}</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
    </div>

</div>
HTML,
            ]
        );

        // ═══════════════════════════════════════════════════════
        // Template 4 — Spécification technique
        // ═══════════════════════════════════════════════════════

        DocumentTemplate::updateOrCreate(
            ['slug' => 'technical-spec'],
            [
                'name' => 'Spécification technique',
                'category' => 'project',
                'requires_signature' => false,
                'is_active' => true,
                'sort_order' => 4,
                'default_locale' => 'fr',
                'available_variables' => [
                    'project_name',
                    'tech_stack',
                    'features',
                    'architecture',
                    'date',
                ],
                'body' => <<<'HTML'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Spécification technique</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 10px;">Technical Specification</p>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">
        Projet : <strong>{{ project_name }}</strong> — Date : {{ date }}
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">1. Présentation du projet</h3>
    <p style="margin-bottom: 20px;">
        Ce document décrit les spécifications techniques du projet <strong>{{ project_name }}</strong>.
        Il constitue le référentiel technique pour l'ensemble de l'équipe de développement et sert
        de base à la conception, au développement et à la validation des livrables.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">2. Stack technologique</h3>
    <p style="margin-bottom: 10px;">
        Les technologies et outils sélectionnés pour la réalisation du projet sont les suivants :
    </p>
    <div style="background: #f0f9ff; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
        {{ tech_stack }}
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">3. Fonctionnalités</h3>
    <p style="margin-bottom: 10px;">
        Les fonctionnalités prévues dans le périmètre de ce projet sont détaillées ci-dessous :
    </p>
    <div style="background: #f0fdf4; border-left: 3px solid #10b981; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
        {{ features }}
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">4. Architecture technique</h3>
    <p style="margin-bottom: 10px;">
        L'architecture globale du système est décrite ci-dessous, incluant les composants principaux,
        les interactions entre services et les choix d'infrastructure :
    </p>
    <div style="background: #faf5ff; border-left: 3px solid #8b5cf6; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
        {{ architecture }}
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">5. Contraintes et exigences non fonctionnelles</h3>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>Performance :</strong> temps de réponse inférieur à 200ms pour les opérations courantes</li>
        <li style="margin-bottom: 8px;"><strong>Sécurité :</strong> authentification sécurisée, chiffrement des données sensibles, protection contre les injections SQL et XSS</li>
        <li style="margin-bottom: 8px;"><strong>Accessibilité :</strong> conformité aux standards WCAG 2.1 niveau AA</li>
        <li style="margin-bottom: 8px;"><strong>Compatibilité :</strong> navigateurs modernes (Chrome, Firefox, Safari, Edge) et appareils mobiles (responsive design)</li>
        <li style="margin-bottom: 8px;"><strong>Déploiement :</strong> intégration continue et déploiement automatisé via pipeline CI/CD</li>
        <li style="margin-bottom: 8px;"><strong>Maintenabilité :</strong> code documenté, respect des conventions de nommage, tests unitaires et d'intégration</li>
    </ul>

    <h3 style="font-size: 16px; margin-bottom: 12px;">6. Environnements</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
            <tr>
                <th style="padding: 10px 16px; background: #f3f4f6; text-align: left; border: 1px solid #e5e7eb;">Environnement</th>
                <th style="padding: 10px 16px; background: #f3f4f6; text-align: left; border: 1px solid #e5e7eb;">Objectif</th>
                <th style="padding: 10px 16px; background: #f3f4f6; text-align: left; border: 1px solid #e5e7eb;">Accès</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Développement</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Développement et tests locaux</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Équipe de développement</td>
            </tr>
            <tr>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Staging</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Validation et recette</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Équipe interne + Client</td>
            </tr>
            <tr>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Production</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Environnement en ligne</td>
                <td style="padding: 10px 16px; border: 1px solid #e5e7eb;">Utilisateurs finaux</td>
            </tr>
        </tbody>
    </table>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="font-style: italic; color: #666; text-align: center;">
        Document généré le {{ date }} — {{ project_name }}
    </p>

</div>
HTML,
            ]
        );
    }
}
