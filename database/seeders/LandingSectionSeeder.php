<?php

namespace Database\Seeders;

use App\Models\LandingSection;
use Illuminate\Database\Seeder;

class LandingSectionSeeder extends Seeder
{
    public function run(): void
    {
        LandingSection::firstOrCreate(['section_key' => 'hero'], [
            'title' => 'Innovative solutions designed for you.',
            'subtitle' => 'Web Development, Mobile & Software',
            'description' => 'Nous transformons vos idées en solutions digitales performantes.',
            'button_text' => 'Découvrir nos projets',
            'button_url' => '/projects',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        LandingSection::firstOrCreate(['section_key' => 'cta'], [
            'title' => 'Prêt à lancer votre projet ?',
            'subtitle' => 'Contactez-nous pour un devis gratuit',
            'button_text' => 'Nous contacter',
            'button_url' => '/contact',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        LandingSection::firstOrCreate(['section_key' => 'about'], [
            'title' => 'À propos de NA Innovations',
            'subtitle' => 'Agence de développement web et mobile basée à Bruxelles',
            'description' => 'NA Innovations est une agence de développement web et mobile fondée par Nawfel Ajari. Nous créons des solutions digitales sur mesure pour les entreprises de toutes tailles : sites vitrines, e-commerce, applications web et mobiles, plateformes SaaS. Notre approche combine créativité, expertise technique et accompagnement personnalisé pour transformer vos idées en produits digitaux performants.',
            'is_active' => true,
            'sort_order' => 3,
            'metadata' => json_encode([
                'mission' => 'Rendre le digital accessible et performant pour chaque entreprise.',
                'vision' => 'Devenir la référence en développement digital en Belgique.',
                'values' => ['Innovation', 'Qualité', 'Transparence', 'Accompagnement'],
            ]),
        ]);

        LandingSection::firstOrCreate(['section_key' => 'process'], [
            'title' => 'Comment on travaille',
            'subtitle' => 'Un processus simple et transparent, de l\'idée à la livraison',
            'is_active' => true,
            'sort_order' => 4,
            'metadata' => json_encode([
                'steps' => [
                    ['title' => 'Brief & Découverte', 'description' => 'Nous discutons de votre projet, vos besoins et vos objectifs. Vous recevez un questionnaire pour cadrer le projet.', 'icon' => 'chat'],
                    ['title' => 'Devis & Planification', 'description' => 'Nous vous envoyons un devis détaillé avec les fonctionnalités, le budget et le planning. Vous acceptez en ligne.', 'icon' => 'document'],
                    ['title' => 'Développement', 'description' => 'Notre équipe développe votre projet. Vous suivez l\'avancement en temps réel depuis votre portail client.', 'icon' => 'code'],
                    ['title' => 'Tests & Révision', 'description' => 'Vous testez le résultat et demandez des ajustements. Nous itérons jusqu\'à votre satisfaction.', 'icon' => 'check'],
                    ['title' => 'Livraison & Lancement', 'description' => 'Votre projet est mis en ligne. Nous gérons le déploiement, le domaine et l\'hébergement.', 'icon' => 'rocket'],
                    ['title' => 'Maintenance & Support', 'description' => 'Nous restons à vos côtés avec un support technique et des mises à jour régulières.', 'icon' => 'support'],
                ],
            ]),
        ]);

        LandingSection::updateOrCreate(['section_key' => 'terms'], [
            'title' => 'Conditions Générales de Vente',
            'description' => '<p><strong>Dernière mise à jour :</strong> 29 mars 2026</p>'
                . '<h2>Article 1 - Identification du prestataire</h2>'
                . '<p>NA Innovations BV, société à responsabilité limitée de droit belge, inscrite à la Banque-Carrefour des Entreprises sous le numéro <strong>1025.939.504</strong>, numéro de TVA <strong>BE 1025.939.504</strong>, dont le siège social est établi au 170 Nijverheidskaai, 1070 Anderlecht, Belgique (ci-après « le Prestataire »).</p>'
                . '<p>Email : <a href="mailto:info@nainnovations.be">info@nainnovations.be</a> - Téléphone : +32 490 22 19 12</p>'

                . '<h2>Article 2 - Champ d\'application</h2>'
                . '<p>Les présentes conditions générales s\'appliquent à toutes les prestations de services fournies par le Prestataire, notamment : le développement de sites web, d\'applications mobiles, de logiciels sur mesure, de plateformes SaaS, ainsi que les services d\'hébergement, de maintenance et de conseil. Toute commande implique l\'acceptation pleine et entière des présentes conditions, conformément aux articles VI.83 et suivants du Code de droit économique belge.</p>'
                . '<p>Les présentes conditions prévalent sur les conditions générales du Client, sauf accord écrit contraire.</p>'

                . '<h2>Article 3 - Devis et commande</h2>'
                . '<p>Tout devis émis par le Prestataire est valable <strong>30 jours calendaires</strong> à compter de sa date d\'émission, sauf mention contraire. Le devis détaille la nature des prestations, le prix, le délai estimé et les conditions de paiement.</p>'
                . '<p>L\'acceptation du devis par le Client - que ce soit par signature, par email ou via le portail en ligne - constitue une commande ferme et définitive. L\'acceptation en ligne fait foi conformément au Règlement eIDAS (UE 910/2014) et à la loi belge du 21 juillet 2016 sur les services de confiance.</p>'

                . '<h2>Article 4 - Prix et TVA</h2>'
                . '<p>Les prix sont exprimés en euros (€) et s\'entendent <strong>hors TVA</strong>, sauf mention contraire. La TVA belge au taux en vigueur (actuellement 21 %) est applicable. Pour les clients assujettis établis dans un autre État membre de l\'UE disposant d\'un numéro de TVA intracommunautaire valide, la TVA est autoliquidée (reverse charge) conformément à la directive 2006/112/CE.</p>'
                . '<p>Le Prestataire se réserve le droit de réviser ses tarifs en cas de modification substantielle du périmètre de la commande. Toute modification fera l\'objet d\'un avenant écrit.</p>'

                . '<h2>Article 5 - Paiement</h2>'
                . '<p>Sauf mention contraire sur la facture, les modalités de paiement sont les suivantes :</p>'
                . '<ul>'
                . '<li><strong>Acompte de 30 %</strong> du montant total à la commande ;</li>'
                . '<li><strong>Solde</strong> à la livraison ou selon l\'échéancier convenu.</li>'
                . '</ul>'
                . '<p>Les factures sont payables dans un délai de <strong>30 jours</strong> à compter de la date d\'émission, par virement bancaire. En cas de retard de paiement, un intérêt de retard de <strong>10 % par an</strong> est applicable de plein droit et sans mise en demeure, conformément à la loi du 2 août 2002 concernant la lutte contre le retard de paiement dans les transactions commerciales. Une indemnité forfaitaire de <strong>40 €</strong> pour frais de recouvrement est également due de plein droit (conformément à l\'article 6 de ladite loi).</p>'

                . '<h2>Article 6 - Délais de livraison</h2>'
                . '<p>Les délais de livraison sont communiqués à titre indicatif et ne constituent pas des délais de rigueur. Le Prestataire s\'engage à informer le Client de tout retard prévisible. Un retard raisonnable ne peut donner lieu à la résiliation du contrat ni à des dommages et intérêts, sauf négligence grave ou intentionnelle du Prestataire.</p>'
                . '<p>Le Client s\'engage à fournir les éléments nécessaires (contenus, visuels, accès, validations) dans les délais convenus. Tout retard imputable au Client reporte d\'autant les délais de livraison.</p>'

                . '<h2>Article 7 - Propriété intellectuelle</h2>'
                . '<p>Pendant toute la durée du projet, l\'ensemble des travaux réalisés (code source, designs, créations graphiques, contenus techniques) restent la <strong>propriété exclusive</strong> du Prestataire. Le transfert des droits d\'utilisation au Client n\'intervient qu\'après le <strong>paiement intégral</strong> de toutes les factures liées au projet.</p>'
                . '<p>Après paiement complet, le Client obtient une <strong>licence d\'utilisation non exclusive</strong> lui permettant d\'exploiter les livrables pour l\'usage convenu. Le Prestataire conserve le droit de mentionner le projet dans son portfolio, sauf opposition écrite du Client.</p>'
                . '<p>Les composants et bibliothèques open source utilisés restent soumis à leurs licences respectives. Le Prestataire ne transfère pas les droits sur les outils, frameworks et méthodologies internes réutilisables.</p>'

                . '<h2>Article 8 - Confidentialité</h2>'
                . '<p>Chaque partie s\'engage à garder confidentielles les informations de l\'autre partie obtenues dans le cadre du contrat. Cette obligation perdure pendant <strong>3 ans</strong> après la fin de la relation contractuelle. Un accord de non-divulgation (NDA) peut être signé préalablement via la plateforme.</p>'

                . '<h2>Article 9 - Garantie et maintenance</h2>'
                . '<p>Le Prestataire garantit la conformité des livrables au cahier des charges validé. Le Client dispose d\'un délai de <strong>14 jours</strong> après la livraison pour signaler toute non-conformité. Passé ce délai, les livrables sont réputés acceptés.</p>'
                . '<p>Les corrections de bugs liés au développement sont assurées gratuitement pendant <strong>30 jours</strong> après la livraison. Les évolutions, nouvelles fonctionnalités et modifications du périmètre font l\'objet d\'un devis complémentaire.</p>'
                . '<p>Les services d\'hébergement et de maintenance récurrents sont facturés selon les conditions du contrat de service concerné, avec renouvellement automatique sauf résiliation notifiée <strong>30 jours</strong> avant l\'échéance.</p>'

                . '<h2>Article 10 - Limitation de responsabilité</h2>'
                . '<p>La responsabilité totale du Prestataire est limitée au <strong>montant total facturé</strong> pour le projet concerné. Le Prestataire ne peut en aucun cas être tenu responsable des dommages indirects tels que : perte de chiffre d\'affaires, perte de données, atteinte à l\'image, manque à gagner ou toute perte de nature économique indirecte.</p>'
                . '<p>Le Prestataire ne saurait être tenu responsable des interruptions ou dysfonctionnements causés par des prestataires tiers (hébergeur, registrar, services cloud), ni des cas de force majeure au sens de l\'article 5.226 du Code civil belge.</p>'

                . '<h2>Article 11 - Résiliation</h2>'
                . '<p>En cas de résiliation anticipée par le Client, les sommes déjà versées restent acquises au Prestataire à titre d\'indemnisation des travaux réalisés. Le Client est tenu de régler les prestations effectuées jusqu\'à la date de résiliation.</p>'
                . '<p>Le Prestataire se réserve le droit de suspendre ou de résilier le contrat en cas de défaut de paiement persistant après une mise en demeure restée sans effet pendant <strong>15 jours</strong>.</p>'

                . '<h2>Article 12 - Protection des données</h2>'
                . '<p>Le Prestataire traite les données personnelles conformément au Règlement général sur la protection des données (RGPD - Règlement UE 2016/679) et à la loi belge du 30 juillet 2018. Pour plus d\'informations, consultez notre <a href="/privacy">Politique de Confidentialité</a>.</p>'

                . '<h2>Article 13 - Droit applicable et juridiction</h2>'
                . '<p>Les présentes conditions sont régies par le <strong>droit belge</strong>. En cas de litige, les parties s\'engagent à rechercher une solution amiable dans un délai de 30 jours. À défaut d\'accord, les <strong>tribunaux de l\'arrondissement judiciaire de Bruxelles</strong> seront seuls compétents.</p>'
                . '<p>Le Client consommateur peut également recourir à la plateforme européenne de règlement des litiges en ligne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>.</p>',
            'is_active' => true,
            'sort_order' => 10,
        ]);

        LandingSection::updateOrCreate(['section_key' => 'privacy'], [
            'title' => 'Politique de Confidentialité',
            'description' => '<p><strong>Dernière mise à jour :</strong> 29 mars 2026</p>'
                . '<p>La présente politique de confidentialité décrit la manière dont NA Innovations BV collecte, utilise et protège vos données personnelles, conformément au Règlement général sur la protection des données (RGPD - Règlement UE 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l\'égard des traitements de données à caractère personnel.</p>'

                . '<h2>1. Responsable du traitement</h2>'
                . '<p><strong>NA Innovations BV</strong><br>'
                . 'BCE : 1025.939.504<br>'
                . '170 Nijverheidskaai, 1070 Anderlecht, Belgique<br>'
                . 'Email : <a href="mailto:info@nainnovations.be">info@nainnovations.be</a><br>'
                . 'Téléphone : +32 490 22 19 12</p>'

                . '<h2>2. Données personnelles collectées</h2>'
                . '<p>Nous collectons les catégories de données suivantes :</p>'
                . '<ul>'
                . '<li><strong>Données d\'identification :</strong> nom, prénom, adresse email, numéro de téléphone, nom de l\'entreprise, numéro de TVA, adresse postale.</li>'
                . '<li><strong>Données de compte :</strong> identifiants de connexion (email, mot de passe hashé), rôle utilisateur, préférences de langue et de thème.</li>'
                . '<li><strong>Données de projet :</strong> informations relatives aux projets commandés, documents échangés, historique des communications.</li>'
                . '<li><strong>Données financières :</strong> montants facturés, historique de paiement, coordonnées bancaires (IBAN) pour les partenaires.</li>'
                . '<li><strong>Données techniques :</strong> adresse IP, type de navigateur, système d\'exploitation, pages visitées, horodatage des visites (via cookies et journaux serveur).</li>'
                . '</ul>'

                . '<h2>3. Finalités et base légale du traitement</h2>'
                . '<table style="width:100%; border-collapse:collapse; margin:16px 0;">'
                . '<tr style="border-bottom:1px solid #e5e7eb;"><th style="text-align:left; padding:8px; font-weight:600;">Finalité</th><th style="text-align:left; padding:8px; font-weight:600;">Base légale (RGPD Art. 6)</th></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Gestion de la relation client et exécution des contrats</td><td style="padding:8px;">Exécution du contrat (Art. 6.1.b)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Envoi de devis, factures et documents contractuels</td><td style="padding:8px;">Exécution du contrat (Art. 6.1.b)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Suivi de projet et communications opérationnelles</td><td style="padding:8px;">Exécution du contrat (Art. 6.1.b)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Calcul et versement des commissions partenaires</td><td style="padding:8px;">Exécution du contrat (Art. 6.1.b)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Obligations comptables et fiscales</td><td style="padding:8px;">Obligation légale (Art. 6.1.c)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Amélioration de nos services et analyse d\'utilisation</td><td style="padding:8px;">Intérêt légitime (Art. 6.1.f)</td></tr>'
                . '<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px;">Communications marketing et newsletters</td><td style="padding:8px;">Consentement (Art. 6.1.a)</td></tr>'
                . '<tr><td style="padding:8px;">Sécurité de la plateforme (journalisation, détection de fraude)</td><td style="padding:8px;">Intérêt légitime (Art. 6.1.f)</td></tr>'
                . '</table>'

                . '<h2>4. Durée de conservation</h2>'
                . '<p>Nous conservons vos données personnelles selon les durées suivantes :</p>'
                . '<ul>'
                . '<li><strong>Données de compte client :</strong> pendant toute la durée de la relation commerciale, puis <strong>5 ans</strong> après la dernière interaction (obligation comptable belge - Art. III.86 du Code de droit économique).</li>'
                . '<li><strong>Factures et données comptables :</strong> <strong>7 ans</strong> à compter de la clôture de l\'exercice (obligation fiscale belge - Art. 315 du CIR 92).</li>'
                . '<li><strong>Données de navigation (cookies) :</strong> maximum <strong>13 mois</strong> (recommandation de l\'Autorité de protection des données belge).</li>'
                . '<li><strong>Candidatures et données de partenaires inactifs :</strong> <strong>2 ans</strong> après la dernière interaction.</li>'
                . '</ul>'
                . '<p>Les données sont supprimées ou anonymisées à l\'expiration de ces délais.</p>'

                . '<h2>5. Destinataires des données</h2>'
                . '<p>Vos données personnelles peuvent être partagées avec :</p>'
                . '<ul>'
                . '<li><strong>Notre équipe interne :</strong> administrateurs, développeurs assignés à votre projet.</li>'
                . '<li><strong>Sous-traitants techniques :</strong> hébergeur (serveurs UE), fournisseur d\'emails transactionnels, service de génération PDF.</li>'
                . '<li><strong>Partenaires de parrainage :</strong> uniquement les informations nécessaires au calcul de leur commission (nom du projet, montant - jamais vos coordonnées personnelles sans votre accord).</li>'
                . '<li><strong>Autorités publiques :</strong> uniquement sur demande légale (administration fiscale, autorités judiciaires).</li>'
                . '</ul>'
                . '<p>Nous ne vendons jamais vos données à des tiers. Tous nos sous-traitants sont liés par des contrats de traitement conformes à l\'article 28 du RGPD.</p>'

                . '<h2>6. Transferts internationaux</h2>'
                . '<p>Vos données sont hébergées au sein de l\'<strong>Union européenne</strong>. En cas de transfert vers un pays tiers, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types de la Commission européenne ou décision d\'adéquation).</p>'

                . '<h2>7. Cookies</h2>'
                . '<p>Notre site utilise les catégories de cookies suivantes :</p>'
                . '<ul>'
                . '<li><strong>Cookies strictement nécessaires :</strong> session d\'authentification, jeton CSRF, préférences de langue. Ces cookies ne requièrent pas votre consentement.</li>'
                . '<li><strong>Cookies de performance :</strong> analyse anonyme de l\'utilisation du site. Ces cookies ne sont déposés qu\'avec votre <strong>consentement explicite</strong>.</li>'
                . '</ul>'
                . '<p>Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur. La suppression des cookies nécessaires peut affecter le fonctionnement du site.</p>'

                . '<h2>8. Vos droits</h2>'
                . '<p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>'
                . '<ul>'
                . '<li><strong>Droit d\'accès</strong> (Art. 15) : obtenir une copie de vos données personnelles.</li>'
                . '<li><strong>Droit de rectification</strong> (Art. 16) : corriger des données inexactes ou incomplètes.</li>'
                . '<li><strong>Droit à l\'effacement</strong> (Art. 17) : demander la suppression de vos données (« droit à l\'oubli »), sous réserve de nos obligations légales de conservation.</li>'
                . '<li><strong>Droit à la limitation</strong> (Art. 18) : limiter le traitement de vos données dans certains cas.</li>'
                . '<li><strong>Droit à la portabilité</strong> (Art. 20) : recevoir vos données dans un format structuré et lisible par machine.</li>'
                . '<li><strong>Droit d\'opposition</strong> (Art. 21) : vous opposer au traitement fondé sur l\'intérêt légitime.</li>'
                . '<li><strong>Droit de retirer votre consentement</strong> (Art. 7.3) : à tout moment, sans affecter la licéité du traitement antérieur.</li>'
                . '</ul>'
                . '<p>Pour exercer ces droits, contactez-nous à <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>. Nous répondrons dans un délai de <strong>30 jours</strong> conformément au RGPD. Vous pouvez également supprimer votre compte directement depuis votre profil sur la plateforme.</p>'

                . '<h2>9. Sécurité des données</h2>'
                . '<p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>'
                . '<ul>'
                . '<li>Chiffrement des communications via HTTPS (TLS 1.2+)</li>'
                . '<li>Mots de passe hashés avec l\'algorithme bcrypt</li>'
                . '<li>Accès aux données restreint selon le principe du moindre privilège</li>'
                . '<li>Protection financière par code PIN avec verrouillage automatique</li>'
                . '<li>Journalisation des accès et des actions sensibles</li>'
                . '<li>Sauvegardes régulières avec chiffrement</li>'
                . '</ul>'

                . '<h2>10. Réclamation</h2>'
                . '<p>Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d\'introduire une réclamation auprès de :</p>'
                . '<p><strong>Autorité de protection des données (APD)</strong><br>'
                . 'Rue de la Presse 35, 1000 Bruxelles<br>'
                . 'Téléphone : +32 2 274 48 00<br>'
                . 'Site web : <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener">www.autoriteprotectiondonnees.be</a><br>'
                . 'Email : contact@apd-gba.be</p>'

                . '<h2>11. Modifications</h2>'
                . '<p>Nous nous réservons le droit de modifier la présente politique à tout moment. Toute modification substantielle sera communiquée par email ou via un bandeau sur la plateforme. La date de dernière mise à jour est indiquée en haut de cette page.</p>',
            'is_active' => true,
            'sort_order' => 11,
        ]);
    }
}
