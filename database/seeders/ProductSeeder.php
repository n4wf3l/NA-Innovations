<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::updateOrCreate(
            ['slug' => 'clubmanager'],
            [
                'name' => 'ClubManager',
                'tagline' => 'La plateforme tout-en-un pour les clubs de football et de futsal',
                'description' => '<h2>La gestion complète de votre club sportif</h2>
<p>ClubManager est une plateforme SaaS conçue spécifiquement pour les clubs de football et de futsal en Belgique. Elle centralise toutes les opérations administratives, sportives et relationnelles en un seul endroit.</p>

<h3>Inscription en ligne des membres</h3>
<p>Permettez aux parents et joueurs de s\'inscrire directement en ligne. Formulaires personnalisables, paiement intégré, et validation automatique des documents requis.</p>

<h3>Gestion des certificats médicaux</h3>
<p>Suivi complet des certificats de guérison, certificats médicaux d\'aptitude, et rappels automatiques pour les renouvellements. Plus jamais de joueur sur le terrain sans documents valides.</p>

<h3>Déclarations d\'accidents</h3>
<p>Processus simplifié pour les déclarations d\'accidents sportifs. Génération automatique des formulaires pour les assurances, suivi du statut et historique complet.</p>

<h3>Décharges de responsabilité</h3>
<p>Gestion numérique des décharges parentales et de responsabilité. Signatures électroniques, archivage sécurisé et accès instantané en cas de besoin.</p>

<h3>Gestion des équipes et joueurs</h3>
<p>Organisation des équipes par catégorie d\'âge, gestion des effectifs, statistiques individuelles et collectives, et communication ciblée par équipe.</p>

<h3>Planification des matchs et entraînements</h3>
<p>Calendrier intelligent avec gestion des disponibilités des terrains, convocations automatiques, et synchronisation avec les calendriers des fédérations.</p>

<h3>Portail parents</h3>
<p>Espace dédié aux parents avec accès aux plannings, résultats, documents de leur enfant, et communication directe avec les entraîneurs.</p>',
                'features' => [
                    'Inscription en ligne des membres',
                    'Planification des tests de sélection',
                    'Certificats médicaux (certificat de guérison)',
                    'Déclarations d\'accidents',
                    'Décharges de responsabilité',
                    'Gestion des équipes et joueurs',
                    'Planification des matchs',
                    'Portail parents',
                    'Intégration de paiement',
                    'Multilingue (FR/NL)',
                ],
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL'],
                'pricing_monthly' => 149.00,
                'pricing_yearly' => 1490.00,
                'pricing_custom' => false,
                'status' => 'in_development',
                'target_audience' => 'Clubs de football et de futsal belges, académies',
                'is_published' => true,
                'is_featured' => true,
                'sort_order' => 1,
            ]
        );

        Product::updateOrCreate(
            ['slug' => 'restoconnect'],
            [
                'name' => 'RestoConnect',
                'tagline' => 'Votre propre plateforme de commande en ligne - fini les 30% de commission',
                'description' => '<h2>Reprenez le contrôle de vos commandes en ligne</h2>
<p>RestoConnect permet aux restaurants, cafés et commerces alimentaires de disposer de leur propre système de commande en ligne, sans passer par des plateformes qui prélèvent jusqu\'à 30% de commission sur chaque commande.</p>

<h3>Commande en ligne (retrait et livraison)</h3>
<p>Interface intuitive pour vos clients. Commande en quelques clics avec choix entre retrait au restaurant et livraison à domicile. Estimation du temps de préparation en temps réel.</p>

<h3>Menu numérique avec photos</h3>
<p>Créez et gérez votre menu facilement. Ajoutez des photos appétissantes, gérez les allergènes, les options et suppléments, et mettez à jour vos plats en temps réel.</p>

<h3>Réservations de tables</h3>
<p>Système de réservation intégré avec gestion des créneaux, confirmation automatique, et rappels par SMS ou email. Optimisez votre taux de remplissage.</p>

<h3>Commande par QR code</h3>
<p>Générez des QR codes uniques par table. Vos clients scannent, consultent le menu, commandent et paient directement depuis leur smartphone.</p>

<h3>Gestion des zones de livraison</h3>
<p>Définissez vos zones de livraison sur une carte interactive. Tarifs de livraison automatiques basés sur la distance. Minimum de commande par zone.</p>

<h3>Tableau de bord analytique</h3>
<p>Suivez vos performances en temps réel : chiffre d\'affaires, plats les plus commandés, heures de pointe, taux de conversion et satisfaction client.</p>',
                'features' => [
                    'Commande en ligne (retrait et livraison)',
                    'Menu numérique avec photos',
                    'Réservations de tables',
                    'Commande par QR code',
                    'Gestion des zones de livraison',
                    'Intégration paiement (Stripe/Mollie)',
                    'Comptes clients',
                    'Promotions et codes de réduction',
                    'Notifications de commandes en temps réel',
                    'Tableau de bord analytique',
                ],
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'Tailwind CSS', 'MySQL'],
                'pricing_monthly' => 89.00,
                'pricing_yearly' => 890.00,
                'pricing_custom' => false,
                'status' => 'in_development',
                'target_audience' => 'Restaurants, cafés et commerces alimentaires en Belgique',
                'is_published' => true,
                'is_featured' => true,
                'sort_order' => 2,
            ]
        );
    }
}
