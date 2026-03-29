<?php

namespace Database\Seeders;

use App\Models\PortfolioProject;
use App\Models\Projet;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'nom_societe' => 'TipTong',
                'title' => 'TipTong — Social Tipping Platform',
                'client_name' => 'TipTong',
                'excerpt' => 'Application mobile et plateforme web de pourboire social, permettant aux utilisateurs de donner des tips numériques à des créateurs, artistes et professionnels de service.',
                'context' => 'TipTong souhaitait révolutionner le concept du pourboire en le rendant digital, social et accessible partout. Le défi était de créer une expérience fluide sur mobile et web.',
                'challenge' => 'Intégrer Stripe Connect pour les paiements en temps réel, gérer les comptes multi-devises, et assurer une UX intuitive pour un public non-technique.',
                'solution' => 'Nous avons développé une application mobile cross-platform (iOS/Android) avec un dashboard web pour les professionnels. L\'intégration Stripe gère les paiements instantanés avec split automatique.',
                'results' => 'Plateforme fonctionnelle avec paiements en temps réel, tableau de bord analytique et notifications push.',
                'features' => ['Paiement en temps réel', 'QR Code scan', 'Dashboard analytique', 'Notifications push', 'Multi-devises', 'Profils publics'],
                'tech_stack' => ['React Native', 'Laravel', 'Stripe Connect', 'PostgreSQL', 'Redis', 'Firebase'],
                'category' => 'Mobile App',
                'tags' => ['FinTech', 'Mobile', 'SaaS'],
                'duration_days' => 120,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'testimonial_text' => 'NA Innovations a parfaitement compris notre vision. L\'application est exactement ce qu\'on imaginait, voire mieux.',
                'testimonial_author' => 'Fedrik De Beul',
                'testimonial_role' => 'Fondateur de TipTong',
            ],
            [
                'nom_societe' => 'Académie Congo',
                'title' => 'Académie Congo — Plateforme Éducative',
                'client_name' => 'Académie Congo',
                'excerpt' => 'Plateforme e-learning complète dédiée à l\'éducation congolaise, offrant des cours en ligne, des exercices interactifs et un suivi de progression.',
                'context' => 'L\'Académie Congo avait besoin d\'une plateforme moderne pour démocratiser l\'accès à l\'éducation de qualité en RDC et dans la diaspora.',
                'challenge' => 'Concevoir une plateforme performante même avec des connexions internet limitées, accessible sur tous les appareils.',
                'solution' => 'Application web progressive (PWA) avec mode hors-ligne, vidéos optimisées et interface intuitive adaptée aux réalités locales.',
                'results' => 'Plateforme opérationnelle avec des centaines d\'utilisateurs actifs et un catalogue de cours en croissance.',
                'features' => ['Cours vidéo', 'Quiz interactifs', 'Suivi de progression', 'Mode hors-ligne', 'Certificats', 'Espace enseignant'],
                'tech_stack' => ['React', 'Laravel', 'MySQL', 'Tailwind CSS', 'FFmpeg', 'PWA'],
                'category' => 'Web Platform',
                'tags' => ['EdTech', 'E-learning', 'PWA'],
                'duration_days' => 90,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
                'testimonial_text' => 'Grâce à NA Innovations, notre vision d\'une éducation accessible à tous prend forme. La plateforme est intuitive et performante.',
                'testimonial_author' => 'Équipe Académie Congo',
                'testimonial_role' => 'Direction',
            ],
            [
                'nom_societe' => 'BX Cars',
                'title' => 'BX Cars — Vitrine Automobile',
                'client_name' => 'BX Cars',
                'excerpt' => 'Site vitrine moderne pour un concessionnaire automobile bruxellois, avec catalogue interactif et formulaire de contact intelligent.',
                'context' => 'BX Cars avait besoin d\'un site professionnel pour présenter son stock de véhicules et générer des leads qualifiés.',
                'challenge' => 'Créer un catalogue automobile élégant avec recherche avancée, tout en maintenant des temps de chargement rapides.',
                'solution' => 'Site vitrine responsive avec galerie photo HD, filtres de recherche dynamiques et intégration WhatsApp pour le contact direct.',
                'results' => 'Augmentation significative des demandes de contact en ligne et meilleure visibilité sur Google.',
                'features' => ['Catalogue véhicules', 'Galerie HD', 'Filtres de recherche', 'WhatsApp intégré', 'SEO optimisé', 'Responsive'],
                'tech_stack' => ['React', 'Inertia.js', 'Laravel', 'Tailwind CSS', 'MySQL'],
                'category' => 'Site Vitrine',
                'tags' => ['Automobile', 'Vitrine', 'SEO'],
                'duration_days' => 30,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
            ],
            [
                'nom_societe' => 'The Next Level Barbershop',
                'title' => 'TNL Barbershop — Réservation en Ligne',
                'client_name' => 'The Next Level Barbershop',
                'excerpt' => 'Site web avec système de réservation en ligne pour un barbershop haut de gamme à Bruxelles.',
                'context' => 'TNL Barbershop souhaitait moderniser sa prise de rendez-vous et réduire les no-shows grâce à un système automatisé.',
                'challenge' => 'Intégrer un système de booking avec rappels SMS, gestion des créneaux et paiement d\'acompte.',
                'solution' => 'Site vitrine élégant avec module de réservation intégré, rappels automatiques et tableau de bord pour le gérant.',
                'results' => 'Réduction de 60% des no-shows et gain de temps administratif considérable.',
                'features' => ['Réservation en ligne', 'Rappels automatiques', 'Galerie portfolio', 'Avis clients', 'Dashboard gérant'],
                'tech_stack' => ['React', 'Laravel', 'Tailwind CSS', 'MySQL', 'Twilio'],
                'category' => 'Site Vitrine',
                'tags' => ['Beauté', 'Booking', 'PME'],
                'duration_days' => 25,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 4,
            ],
            [
                'nom_societe' => 'Casa Bonita Family',
                'title' => 'Casa Bonita — E-commerce Familial',
                'client_name' => 'Casa Bonita Family',
                'excerpt' => 'Boutique en ligne pour une marque familiale de produits artisanaux, avec gestion de stock et paiement sécurisé.',
                'context' => 'Casa Bonita Family voulait passer de la vente sur les réseaux sociaux à une boutique en ligne professionnelle.',
                'challenge' => 'Créer une expérience e-commerce chaleureuse qui reflète l\'identité familiale de la marque.',
                'solution' => 'E-commerce sur mesure avec design chaleureux, panier intelligent, gestion de stock et intégration de paiement Mollie.',
                'results' => 'Boutique en ligne opérationnelle avec un chiffre d\'affaires en croissance mensuelle.',
                'features' => ['Catalogue produits', 'Panier & checkout', 'Paiement Mollie', 'Gestion de stock', 'Suivi commandes', 'Responsive'],
                'tech_stack' => ['React', 'Laravel', 'Mollie', 'Tailwind CSS', 'MySQL'],
                'category' => 'E-commerce',
                'tags' => ['E-commerce', 'Artisanal', 'PME'],
                'duration_days' => 45,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 5,
            ],
            [
                'nom_societe' => 'Dina Kenitra',
                'title' => 'Dina Kenitra — Site Institutionnel',
                'client_name' => 'Dina Kenitra',
                'excerpt' => 'Site institutionnel multilingue pour une organisation basée au Maroc, avec gestion de contenu et actualités.',
                'context' => 'Dina Kenitra avait besoin d\'un site institutionnel professionnel en arabe et en français pour communiquer avec ses membres.',
                'challenge' => 'Support RTL (arabe), performance sur connexions lentes et gestion de contenu autonome par le client.',
                'solution' => 'Site multilingue avec CMS intégré, support RTL natif et optimisation des performances pour le marché africain.',
                'results' => 'Présence en ligne professionnelle avec gestion de contenu autonome par l\'équipe locale.',
                'features' => ['Multilingue FR/AR', 'Support RTL', 'CMS intégré', 'Actualités', 'Galerie photo', 'Formulaire contact'],
                'tech_stack' => ['React', 'Laravel', 'Tailwind CSS', 'MySQL', 'i18next'],
                'category' => 'Site Vitrine',
                'tags' => ['Institutionnel', 'Multilingue', 'Maroc'],
                'duration_days' => 35,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 6,
            ],
            [
                'nom_societe' => 'Sogno D\'Oro',
                'title' => 'Sogno D\'Oro — E-commerce Parfumerie',
                'client_name' => 'Sogno D\'Oro',
                'excerpt' => 'Boutique en ligne élégante pour une marque de parfums de luxe, avec catalogue produits, panier et paiement sécurisé.',
                'context' => 'Sogno D\'Oro souhaitait lancer sa marque de parfums en ligne avec une identité visuelle haut de gamme reflétant le luxe et le raffinement de ses produits.',
                'challenge' => 'Créer une expérience e-commerce luxueuse avec un catalogue de parfums visuellement riche, tout en maintenant des performances optimales et un tunnel de conversion fluide.',
                'solution' => 'Site e-commerce sur mesure avec design premium, galerie produits HD, filtres par famille olfactive, panier intelligent et intégration de paiement sécurisé. Hébergement et nom de domaine gérés par NA Innovations.',
                'results' => 'Boutique en ligne opérationnelle avec un design qui reflète l\'identité luxueuse de la marque. Taux de conversion optimisé grâce à un tunnel d\'achat simplifié.',
                'features' => ['Catalogue parfums', 'Filtres olfactifs', 'Panier & checkout', 'Paiement sécurisé', 'Design premium', 'Responsive'],
                'tech_stack' => ['React', 'Laravel', 'Tailwind CSS', 'MySQL', 'Stripe'],
                'category' => 'E-commerce',
                'tags' => ['E-commerce', 'Luxe', 'Parfumerie'],
                'duration_days' => 75,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 7,
            ],
            [
                'nom_societe' => 'Vericore',
                'title' => 'Vericore — Site Vitrine Professionnel',
                'client_name' => 'Vericore',
                'excerpt' => 'Site vitrine moderne et professionnel pour une entreprise tech bruxelloise, avec design épuré et optimisation SEO.',
                'context' => 'Vericore avait besoin d\'une présence en ligne professionnelle pour présenter ses services et générer des leads qualifiés.',
                'challenge' => 'Concevoir un site rapide, moderne et bien référencé dans un budget serré.',
                'solution' => 'Site vitrine responsive avec design minimaliste, formulaire de contact intelligent et optimisation SEO complète.',
                'results' => 'Site en ligne performant avec un excellent score Lighthouse et une visibilité améliorée sur Google.',
                'features' => ['Design responsive', 'SEO optimisé', 'Formulaire contact', 'Performance optimale', 'SSL', 'Analytics'],
                'tech_stack' => ['React', 'Laravel', 'Tailwind CSS', 'MySQL'],
                'category' => 'Site Vitrine',
                'tags' => ['Vitrine', 'Tech', 'SEO'],
                'duration_days' => 20,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 8,
            ],
            [
                'nom_societe' => 'RWDM Academy',
                'title' => 'RWDM Academy — Site Vitrine Football',
                'client_name' => 'RWDM Academy',
                'excerpt' => 'Site vitrine pour l\'académie de football du RWDM, développé dans le cadre d\'un stage par Nawfel Ajari.',
                'context' => 'L\'académie de football du RWDM avait besoin d\'un site web pour présenter ses programmes, ses équipes et ses horaires d\'entraînement.',
                'challenge' => 'Créer un site complet et professionnel dans le cadre d\'un stage, avec des contraintes de temps et un budget inexistant.',
                'solution' => 'Site vitrine responsive développé avec Laravel, présentant les programmes de formation, les équipes, le calendrier et un formulaire d\'inscription.',
                'results' => 'Site livré et mis en ligne pendant la durée du stage. Utilisé par l\'académie pour ses inscriptions.',
                'features' => ['Présentation équipes', 'Calendrier', 'Formulaire inscription', 'Galerie photos', 'Responsive', 'SEO'],
                'tech_stack' => ['Laravel', 'Tailwind CSS', 'MySQL'],
                'category' => 'Site Vitrine',
                'tags' => ['Sport', 'Football', 'Stage'],
                'duration_days' => 90,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($projects as $data) {
            $nomSociete = $data['nom_societe'];
            unset($data['nom_societe']);

            // Link to existing Projet if it exists
            $projet = Projet::where('nom_societe', $nomSociete)->first();
            if ($projet) {
                $data['projet_id'] = $projet->id;
            }

            $data['completion_date'] = now()->subDays(rand(30, 180));

            PortfolioProject::updateOrCreate(
                ['title' => $data['title']],
                $data
            );
        }
    }
}
