<?php

namespace Database\Seeders;

use App\Models\PartnerFaq;
use Illuminate\Database\Seeder;

class PartnerFaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'Combien je gagne exactement, et quand suis-je payé ?',
                'category' => 'commissions',
                'sort_order' => 1,
                'answer' => "**Taux de commission standard : 10% du montant HT** du projet signé grâce à votre recommandation.\n\n**Exemple concret :**\nVous nous présentez un client qui signe un projet de **5 000 € HT**. Vous touchez **500 € HT** de commission.\n\n**Quand êtes-vous payé ?**\n- La commission devient **due** dès que le client a payé le premier acompte (généralement 30% à la signature).\n- Le **virement** est effectué le **1er du mois suivant** la facturation finale du projet.\n- Vous recevez automatiquement votre relevé par email + il est consultable dans la section « Commissions ».\n\n**TVA & fiscalité :**\nSi vous êtes auto-entrepreneur, vous nous facturez le montant HT (la TVA n'est pas applicable). Sinon, nous vous demandons une note d'honoraires simple. Vous êtes responsable de votre déclaration fiscale personnelle.\n\n**Et si le client annule ?**\nSi le client annule **avant** signature : aucune commission n'est due.\nSi le client annule **après** signature mais avant livraison : la commission est calculée au prorata du montant déjà facturé.",
            ],
            [
                'question' => 'Que veulent dire les statuts du pipeline (New, Contacted, Brief, Quote, Won, Lost) ?',
                'category' => 'pipeline',
                'sort_order' => 2,
                'answer' => "Voici la signification de chaque étape du pipeline et ce que vous devez attendre :\n\n**🟣 New (Nouveau)** - Vous venez de soumettre le lead. Notre équipe le réceptionne sous 24h ouvrées. **Aucune action de votre part requise.**\n\n**🔵 Contacted (Contacté)** - Notre commercial a pris contact avec le prospect (appel, email ou message LinkedIn). **Durée moyenne à ce stade : 2 à 5 jours.** Vous pouvez relancer le prospect en parallèle pour maintenir l'intérêt.\n\n**🟦 Brief (Cadrage)** - Le prospect a accepté un rendez-vous de cadrage. Nous récupérons ses besoins, son budget et ses contraintes. **Durée moyenne : 5 à 10 jours.** À ce stade, ne le contactez plus directement pour éviter la confusion.\n\n**🟡 Quote (Devis)** - Un devis personnalisé a été envoyé. Le prospect réfléchit. **Durée moyenne : 7 à 21 jours.** C'est le moment crucial : nous pouvons vous demander un coup de pouce (témoignage, recommandation supplémentaire) si besoin.\n\n**🟢 Won (Gagné)** - Le devis est signé ! 🎉 Votre commission est désormais en attente du premier acompte. Vous serez notifié(e) automatiquement.\n\n**🔴 Lost (Perdu)** - Le prospect n'a pas donné suite ou a choisi un concurrent. Pas de commission, mais le lead reste dans votre historique. La raison du « lost » est indiquée dans le détail du lead pour vous aider à mieux qualifier les prochains.",
            ],
            [
                'question' => "Comment savoir si un lead que je veux soumettre n'est pas déjà en base ?",
                'category' => 'leads',
                'sort_order' => 3,
                'answer' => "**Avant de soumettre un lead, vérifiez ces 3 points :**\n\n**1. Email & téléphone uniques**\nLe formulaire de soumission vérifie automatiquement l'email et le téléphone. Si le contact existe déjà, vous serez prévenu(e) immédiatement et la soumission sera bloquée.\n\n**2. Politique d'attribution**\nUn lead vous est attribué pour une durée de **90 jours** à partir de sa soumission. Pendant cette période, si le prospect signe, **la commission est entièrement pour vous**, même si un autre partenaire le contacte ensuite.\n\n**3. Cas particuliers**\n- **Prospect déjà en pipeline avec un autre partenaire** : le système rejette la soumission. Vous voyez un message clair sans révéler l'identité du partenaire d'origine.\n- **Ancien client NA Innovations (>12 mois sans projet)** : il est considéré comme « réactivable » et peut redevenir un lead partenaire.\n- **Prospect avec qui nous étions déjà en discussion directe** : si vous le soumettez, nous vous le signalons et la commission n'est pas attribuée. C'est rare et toujours documenté.\n\n💡 **Conseil :** en cas de doute, utilisez le bouton **« Vérifier ce contact »** dans la page Soumettre un client, avant de remplir tout le formulaire.",
            ],
            [
                'question' => "Mon prospect hésite ou refuse - comment répondre aux objections classiques ?",
                'category' => 'objections',
                'sort_order' => 4,
                'answer' => "Voici les **5 objections les plus fréquentes** et comment y répondre :\n\n**❝ C'est trop cher ❞**\n→ « Je comprends. Combien estimez-vous perdre chaque mois en clients qui ne vous trouvent pas en ligne ? Un site bien fait se rentabilise généralement en 3 à 6 mois. NA Innovations propose aussi un paiement en plusieurs fois sans frais. »\n\n**❝ J'ai déjà un développeur / un cousin qui peut le faire ❞**\n→ « Excellent. Est-ce qu'il peut aussi vous garantir le SEO, l'hébergement sécurisé, la maintenance, les mises à jour de sécurité, et un support quand quelque chose plante un dimanche soir ? Ce qu'on vend, ce n'est pas du code, c'est de la tranquillité. »\n\n**❝ Quels sont vos délais ? ❞**\n→ « Pour un site vitrine professionnel, comptez **3 à 4 semaines** entre la signature et la mise en ligne. Pour une plateforme métier sur-mesure, **8 à 16 semaines** selon la complexité. On est connus pour respecter nos délais - vous pouvez voir nos projets livrés sur notre portfolio. »\n\n**❝ Avez-vous des références dans mon secteur ? ❞**\n→ « Oui, on a déjà travaillé avec [secteur similaire]. Je peux vous envoyer 2-3 cas concrets par email. Voulez-vous que je vous mette directement en contact avec un client satisfait ? »\n\n**❝ Je dois en parler à mon associé / je vais réfléchir ❞**\n→ « Bien sûr. Pour vous aider à présenter le projet à votre associé, je peux organiser un appel de 15 minutes avec l'équipe NA Innovations qui pourra répondre aux questions techniques en direct. Ça vous va si on bloque ça pour cette semaine ? »\n\n💡 **Règle d'or :** ne contredisez jamais frontalement le prospect. Reformulez son objection (« Je comprends, c'est une vraie question… »), puis amenez l'argument.",
            ],
            [
                'question' => "Quelles sont les règles du programme partenaire ?",
                'category' => 'rules',
                'sort_order' => 5,
                'answer' => "**📜 Conditions générales du programme partenaire NA Innovations**\n\n**1. Éligibilité**\nLe programme est ouvert aux freelances, agences, consultants, indépendants ou apporteurs d'affaires. Aucun statut juridique particulier n'est exigé pour participer, mais une facturation valide est requise pour percevoir les commissions.\n\n**2. Exclusivité**\nLe programme **n'est pas exclusif**. Vous pouvez parfaitement travailler avec d'autres prestataires en parallèle.\n\n**3. Attribution d'un lead**\nUn lead que vous soumettez vous est attribué pendant **90 jours**. Si le prospect signe pendant cette période, la commission est intégralement pour vous.\n\n**4. Commissions**\n- Taux standard : **10% du montant HT** signé.\n- Versement le **1er du mois suivant** la facturation finale.\n- Aucune commission si le prospect annule avant signature.\n\n**5. Comportements interdits**\n- ❌ Spam massif (cold emailing automatisé non personnalisé)\n- ❌ Fausses promesses sur nos services, prix ou délais\n- ❌ Usurpation d'identité ou faux profils LinkedIn / Google\n- ❌ Soumission de leads fictifs ou de proches sans intention réelle d'achat\n- ❌ Démarchage de clients existants de NA Innovations\n\nTout manquement entraîne une **suspension immédiate** du compte et une retenue des commissions en cours.\n\n**6. Résiliation**\nVous pouvez quitter le programme à tout moment, sans préavis ni motif. Les commissions déjà acquises au moment de la résiliation vous seront versées normalement.\n\n**7. Confidentialité**\nLes informations sur les leads, prospects et clients sont confidentielles. Toute fuite ou utilisation détournée entraîne une exclusion définitive.\n\n📧 Pour toute question : contactez-nous via le formulaire de la section « Profil ».",
            ],
        ];

        foreach ($faqs as $f) {
            PartnerFaq::updateOrCreate(['question' => $f['question']], array_merge($f, ['is_active' => true]));
        }
    }
}
