<?php

namespace Database\Seeders;

use App\Models\ProspectingEmailTemplate;
use Illuminate\Database\Seeder;

class ProspectingEmailTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'title' => 'Restaurants',
                'sort_order' => 1,
                'body' => "Objet : Augmentez vos commandes en ligne - sans commission\n\nBonjour,\n\nJe me permets de vous contacter car j'ai remarqué que votre restaurant n'a pas encore de site web avec commande en ligne.\n\nNous avons développé une plateforme spécialement conçue pour les restaurants, qui permet à vos clients de commander directement depuis votre propre site - sans payer de commission à Uber Eats ou Deliveroo (qui prennent jusqu'à 30%).\n\nLa plateforme inclut :\n- Menu en ligne avec photos\n- Commande et paiement en ligne\n- Gestion des réservations\n- Tableau de bord pour gérer vos commandes\n\nPuis-je vous envoyer une démonstration ? Cela ne prend que 5 minutes.\n\nCordialement,\n[Votre nom]\nPartenaire NA Innovations",
            ],
            [
                'title' => 'Clubs de football / futsal',
                'sort_order' => 2,
                'body' => "Objet : Plateforme de gestion pour votre club de football\n\nBonjour,\n\nJe vous contacte car nous avons développé une plateforme spécialement conçue pour les clubs de football et futsal en Belgique.\n\nPlusieurs clubs utilisent déjà notre solution pour :\n- L'inscription en ligne des nouveaux membres\n- La planification des tests de sélection\n- La gestion des certificats médicaux et certificats de guérison\n- Les déclarations d'accident\n- Les décharges de responsabilité\n- La gestion des équipes et des matchs\n\nLa plateforme est prête à être déployée et s'adapte à la taille de votre club.\n\nSeriez-vous disponible pour une courte présentation de 10 minutes ?\n\nCordialement,\n[Votre nom]\nPartenaire NA Innovations",
            ],
            [
                'title' => 'Entreprises générales',
                'sort_order' => 3,
                'body' => "Objet : Un site web professionnel pour votre entreprise\n\nBonjour,\n\nJ'ai découvert votre entreprise et je remarque que vous n'avez pas encore de site web professionnel (ou que votre site actuel pourrait être amélioré).\n\nAujourd'hui, plus de 80% des clients recherchent en ligne avant de se déplacer. Sans site web, vous passez à côté de nombreux clients potentiels.\n\nNous créons des sites web modernes, rapides et optimisés pour le référencement Google, à des tarifs compétitifs.\n\nNos services incluent :\n- Sites vitrines professionnels\n- Boutiques en ligne\n- Applications web sur mesure\n- Référencement Google (SEO)\n\nPuis-je vous envoyer quelques exemples de nos réalisations ?\n\nCordialement,\n[Votre nom]\nPartenaire NA Innovations",
            ],
        ];

        foreach ($templates as $tpl) {
            ProspectingEmailTemplate::updateOrCreate(
                ['title' => $tpl['title']],
                array_merge($tpl, ['is_active' => true])
            );
        }
    }
}
