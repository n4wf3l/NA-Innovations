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
        // Template 2 — Contrat de prestation de services (CGV intégrées)
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
                    'company_name',
                    'project_name',
                    'start_date',
                    'total',
                    'payment_terms',
                ],
                'body' => <<<'HTML'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Contrat de prestation de services</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">Service Agreement</p>

    <p style="margin-bottom: 20px;">
        Établi le <strong>{{ start_date }}</strong>, entre les parties suivantes :
    </p>

    <p style="margin-bottom: 10px;">
        <strong>Le prestataire :</strong> {{ company_name }}, ci-après dénommé « le Prestataire »,
    </p>
    <p style="margin-bottom: 30px;">
        <strong>Le client :</strong> {{ client_name }}, agissant pour le compte de {{ client_company }}, ci-après dénommé « le Client ».
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 1 — Objet du contrat</h3>
    <p style="margin-bottom: 20px;">
        Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire s'engage
        à réaliser pour le Client les prestations de services numériques dans le cadre du projet
        <strong>« {{ project_name }} »</strong>. Les prestations comprennent la conception, le développement,
        les tests et la livraison des éléments décrits dans le devis accepté par le Client.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 2 — Durée et calendrier</h3>
    <p style="margin-bottom: 20px;">
        Le contrat entre en vigueur à la date de sa signature par les deux parties. Le calendrier
        de réalisation des prestations est défini d'un commun accord entre les parties. Tout retard
        imputable au Client (retard de validation, absence de retour, indisponibilité des contenus)
        entraîne un décalage proportionnel du calendrier de livraison.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 3 — Prix et modalités de paiement</h3>
    <p style="margin-bottom: 10px;">
        En contrepartie des prestations réalisées, le Client s'engage à verser au Prestataire la somme totale de :
    </p>
    <p style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 10px; color: #111;">
        {{ total }} EUR TTC
    </p>
    <p style="margin-bottom: 10px;">Les modalités de paiement sont les suivantes :</p>
    <div style="background: #f9f9f9; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        {{ payment_terms }}
    </div>
    <p style="margin-bottom: 20px;">
        En cas de retard de paiement, des intérêts de retard seront appliqués au taux légal en vigueur
        majoré de 10 points, sans qu'un rappel préalable ne soit nécessaire, conformément à la loi du
        2 août 2002 concernant la lutte contre le retard de paiement dans les transactions commerciales.
        Une indemnité forfaitaire de 40 € pour frais de recouvrement sera également due.
        Le Prestataire se réserve le droit de suspendre toute prestation en cas de non-paiement
        supérieur à 15 jours après échéance.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 4 — Obligations du Prestataire</h3>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Exécuter les prestations avec diligence et professionnalisme, conformément aux règles de l'art ;</li>
        <li style="margin-bottom: 8px;">Informer le Client de l'avancement des travaux et de toute difficulté rencontrée ;</li>
        <li style="margin-bottom: 8px;">Respecter la confidentialité des informations communiquées par le Client ;</li>
        <li style="margin-bottom: 8px;">Livrer les prestations conformément aux spécifications convenues dans le devis accepté.</li>
    </ul>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 5 — Obligations du Client</h3>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Fournir en temps utile tous les éléments nécessaires à la réalisation des prestations (contenus, accès, validations) ;</li>
        <li style="margin-bottom: 8px;">Désigner un interlocuteur unique habilité à prendre des décisions ;</li>
        <li style="margin-bottom: 8px;">Procéder aux validations dans un délai raisonnable (5 jours ouvrables sauf accord contraire) ;</li>
        <li style="margin-bottom: 8px;">Régler les factures aux échéances prévues.</li>
    </ul>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 6 — Propriété intellectuelle</h3>
    <p style="margin-bottom: 20px;">
        Tous les droits de propriété intellectuelle relatifs aux livrables développés spécifiquement
        pour le Client dans le cadre du présent contrat seront transférés au Client après paiement
        intégral de l'ensemble des sommes dues. Jusqu'au paiement complet, le Prestataire conserve
        l'intégralité des droits. Le Prestataire conserve en tout état de cause le droit d'utiliser
        les techniques, méthodologies, savoir-faire et composants génériques développés ou utilisés
        lors de l'exécution du contrat.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 7 — Garantie et maintenance</h3>
    <p style="margin-bottom: 20px;">
        Le Prestataire garantit le bon fonctionnement des livrables pendant une période de 30 jours
        suivant la réception définitive. Cette garantie couvre la correction des anomalies bloquantes
        et majeures. Les évolutions fonctionnelles, modifications de périmètre et adaptations à de
        nouveaux environnements ne sont pas couvertes par cette garantie et feront l'objet de devis
        complémentaires.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 8 — Responsabilité</h3>
    <p style="margin-bottom: 20px;">
        La responsabilité totale du Prestataire au titre du présent contrat ne saurait excéder le
        montant total des sommes effectivement perçues. Le Prestataire ne pourra en aucun cas être
        tenu responsable des dommages indirects tels que perte de chiffre d'affaires, perte de
        clientèle, perte de données ou atteinte à l'image de marque.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 9 — Résiliation</h3>
    <p style="margin-bottom: 10px;">Le présent contrat peut être résilié :</p>
    <ul style="margin-bottom: 20px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Par accord mutuel des parties, à tout moment, par notification écrite ;</li>
        <li style="margin-bottom: 8px;">Par l'une des parties en cas de manquement grave de l'autre partie à ses obligations, après mise en demeure par lettre recommandée restée sans effet pendant 15 jours ;</li>
        <li style="margin-bottom: 8px;">Par le Client, avec un préavis de 30 jours, sous réserve du paiement intégral des prestations déjà réalisées et des frais engagés.</li>
    </ul>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 10 — Force majeure</h3>
    <p style="margin-bottom: 20px;">
        Aucune partie ne sera tenue responsable d'un manquement à ses obligations contractuelles
        résultant d'un événement de force majeure tel que défini par l'article 1148 du Code civil.
        La partie invoquant la force majeure devra en informer l'autre partie dans les 48 heures.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 11 — Droit applicable et juridiction</h3>
    <p style="margin-bottom: 30px;">
        Le présent contrat est régi par le droit belge. Tout litige relatif à l'interprétation,
        l'exécution ou la résiliation du présent contrat sera soumis aux tribunaux compétents
        de Bruxelles, Belgique, après tentative de résolution amiable.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="margin-bottom: 20px; font-style: italic; color: #666;">
        Fait en deux exemplaires originaux, chaque partie reconnaissant avoir reçu le sien.
    </p>

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Prestataire — {{ company_name }}</p>
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
                'body' => <<<'HTML_TECHSPEC'
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
HTML_TECHSPEC,
            ]
        );

        // ═══════════════════════════════════════════════════════
        // Template 5 — Conditions Générales de Vente (CGV)
        // ═══════════════════════════════════════════════════════

        DocumentTemplate::updateOrCreate(
            ['slug' => 'cgv'],
            [
                'name' => 'Conditions Générales de Vente (CGV)',
                'category' => 'legal',
                'requires_signature' => true,
                'is_active' => true,
                'sort_order' => 5,
                'default_locale' => 'fr',
                'available_variables' => [
                    'client_name',
                    'client_company',
                    'company_name',
                    'project_name',
                    'start_date',
                    'total',
                    'payment_terms',
                ],
                'body' => <<<'HTML_CGV'
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.7;">

    <h2 style="text-align: center; font-size: 24px; margin-bottom: 8px; color: #111;">Conditions Générales de Vente</h2>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 40px;">Applicables à compter du {{ start_date }}</p>

    <p style="margin-bottom: 20px;">
        Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toutes les prestations
        de services numériques fournies par <strong>{{ company_name }}</strong> (ci-après « le Prestataire »)
        au client <strong>{{ client_name }}</strong>, agissant pour le compte de <strong>{{ client_company }}</strong>
        (ci-après « le Client »).
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 1 — Champ d'application</h3>
    <p style="margin-bottom: 20px;">
        Les présentes CGV s'appliquent à l'ensemble des prestations conclues par le Prestataire auprès
        du Client. Le Client déclare avoir pris connaissance des présentes CGV et les avoir acceptées
        avant la passation de toute commande. Toute commande implique l'adhésion sans réserve du Client
        aux présentes CGV, à l'exclusion de tout autre document.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 2 — Devis et commandes</h3>
    <p style="margin-bottom: 20px;">
        Toute prestation fait l'objet d'un devis préalable détaillé. Le devis est valable pour la durée
        qui y est mentionnée. La commande n'est considérée comme ferme et définitive qu'après acceptation
        écrite du devis par le Client et réception de l'acompte prévu. Toute modification de la commande
        demandée par le Client après acceptation du devis pourra donner lieu à un avenant et à une
        facturation complémentaire.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 3 — Tarifs et paiement</h3>
    <p style="margin-bottom: 10px;">
        Les prix sont indiqués en euros et sont, sauf mention contraire, hors taxes. La TVA applicable
        sera ajoutée au taux en vigueur. Les modalités de paiement applicables au projet
        <strong>« {{ project_name }} »</strong> sont :
    </p>
    <div style="background: #f9f9f9; border-left: 3px solid #3b82f6; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        {{ payment_terms }}
    </div>
    <p style="margin-bottom: 20px;">
        <strong>Retard de paiement :</strong> Conformément à la loi du 2 août 2002 concernant la lutte
        contre le retard de paiement dans les transactions commerciales, tout retard de paiement
        entraînera de plein droit et sans mise en demeure préalable : (a) l'application d'intérêts
        de retard au taux directeur de la BCE majoré de 8 points ; (b) une indemnité forfaitaire
        de 40 € pour frais de recouvrement ; (c) le droit pour le Prestataire de suspendre
        immédiatement toute prestation en cours.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 4 — Exécution des prestations</h3>
    <p style="margin-bottom: 20px;">
        Le Prestataire s'engage à exécuter les prestations avec tout le soin et la diligence requis,
        conformément aux règles de l'art de la profession. Le Prestataire est soumis à une obligation
        de moyens et non de résultat. Les délais de livraison sont donnés à titre indicatif et ne
        constituent pas un engagement ferme, sauf stipulation contraire expresse. Le Client s'engage
        à fournir tous les éléments nécessaires dans les délais convenus ; tout retard du Client
        entraîne un report proportionnel du calendrier.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 5 — Réception et validation</h3>
    <p style="margin-bottom: 20px;">
        À la livraison de chaque phase ou livrable, le Client dispose d'un délai de 5 jours ouvrables
        pour formuler ses observations. Passé ce délai, les livrables sont réputés acceptés. Un
        procès-verbal de réception sera établi pour formaliser l'acceptation définitive du projet.
        Les corrections mineures ne constituent pas un motif de refus de réception.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 6 — Propriété intellectuelle</h3>
    <p style="margin-bottom: 20px;">
        Le transfert des droits de propriété intellectuelle sur les livrables n'intervient qu'après
        paiement intégral du prix convenu. Jusqu'au paiement complet, le Prestataire conserve
        l'intégralité des droits de propriété intellectuelle. Le Prestataire conserve en tout état
        de cause le droit de mentionner la réalisation dans ses références commerciales et de réutiliser
        les composants génériques, frameworks et méthodologies développés ou utilisés dans le cadre
        du projet.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 7 — Garantie</h3>
    <p style="margin-bottom: 20px;">
        Le Prestataire garantit la conformité des livrables aux spécifications convenues pendant une
        durée de 30 jours à compter de la réception définitive. Cette garantie est limitée à la
        correction des dysfonctionnements reproductibles. Les évolutions, ajouts de fonctionnalités
        et adaptations ne sont pas couverts par cette garantie.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 8 — Limitation de responsabilité</h3>
    <p style="margin-bottom: 20px;">
        La responsabilité totale du Prestataire, toutes causes confondues, est limitée au montant
        total des sommes effectivement versées par le Client au titre du contrat concerné. En aucun
        cas le Prestataire ne pourra être tenu responsable des dommages indirects, notamment la perte
        de chiffre d'affaires, la perte de clientèle, la perte de données, l'atteinte à l'image
        de marque ou le manque à gagner.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 9 — Confidentialité</h3>
    <p style="margin-bottom: 20px;">
        Chaque partie s'engage à traiter comme confidentielles toutes les informations reçues de
        l'autre partie dans le cadre de l'exécution du contrat. Cette obligation de confidentialité
        subsiste pendant une durée de 2 ans après la fin du contrat.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 10 — Protection des données</h3>
    <p style="margin-bottom: 20px;">
        Le Prestataire s'engage à traiter les données personnelles conformément au Règlement Général
        sur la Protection des Données (RGPD — Règlement UE 2016/679). Les données personnelles
        collectées dans le cadre du contrat ne sont utilisées qu'aux fins de l'exécution des prestations
        et ne sont en aucun cas cédées à des tiers sans le consentement préalable du Client.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 11 — Résiliation</h3>
    <p style="margin-bottom: 20px;">
        En cas de manquement grave par l'une des parties à l'une de ses obligations, le contrat
        pourra être résilié de plein droit 15 jours après mise en demeure par lettre recommandée
        restée sans effet. Le Client peut résilier le contrat à tout moment avec un préavis de
        30 jours, sous réserve du paiement des prestations déjà réalisées et engagées.
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 12 — Force majeure</h3>
    <p style="margin-bottom: 20px;">
        Aucune partie ne sera tenue responsable de l'inexécution de ses obligations si cette
        inexécution résulte d'un cas de force majeure au sens de la jurisprudence belge
        (événement imprévisible, irrésistible et extérieur aux parties).
    </p>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Article 13 — Droit applicable et juridiction</h3>
    <p style="margin-bottom: 30px;">
        Les présentes CGV sont soumises au droit belge. En cas de litige, les parties s'engagent
        à rechercher une solution amiable. À défaut d'accord, les tribunaux de l'arrondissement
        judiciaire de Bruxelles seront seuls compétents.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

    <p style="text-align: center; font-style: italic; color: #666; margin-bottom: 20px;">
        Le Client déclare avoir pris connaissance des présentes Conditions Générales de Vente
        et les accepter sans réserve.
    </p>

    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Prestataire — {{ company_name }}</p>
            <p style="margin-bottom: 4px;">Nom : ___________________________</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
        <div style="width: 45%;">
            <p style="font-weight: bold; margin-bottom: 8px;">Le Client — {{ client_company }}</p>
            <p style="margin-bottom: 4px;">Nom : {{ client_name }}</p>
            <p style="margin-bottom: 4px;">Date : ___________________________</p>
            <p>Signature (précédée de la mention « Lu et approuvé ») :</p>
            <div style="height: 80px; border-bottom: 1px solid #333;"></div>
        </div>
    </div>

</div>
HTML_CGV,
            ]
        );
    }
}
