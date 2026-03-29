<?php

namespace Database\Seeders;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\PortfolioProject;
use App\Models\ProjectBudgetLine;
use App\Models\ProjectPayout;
use App\Models\Projet;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\RecurringService;
use App\Models\ReferralPartner;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RealDataSeeder extends Seeder
{
    public function run(): void
    {
        // =====================================================================
        // USERS
        // =====================================================================

        // ─── ADMIN ───────────────────────────────────────────────────────────
        $nawfel = User::updateOrCreate(
            ['email' => 'info@nawfelajari.be'],
            [
                'name'          => 'Nawfel Ajari',
                'password'      => Hash::make('security'),
                'role'          => 'admin',
                'is_active'     => true,
                'financial_pin' => Hash::make('1234'),
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        // ─── DEVELOPERS ─────────────────────────────────────────────────────
        $kristian = User::updateOrCreate(
            ['email' => 'kristian@na-innovations.be'],
            [
                'name'          => 'Kristian Vasiaj',
                'password'      => Hash::make('password'),
                'role'          => 'developer',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $shakil = User::updateOrCreate(
            ['email' => 'shakil@na-innovations.be'],
            [
                'name'          => 'Shakil Nirob',
                'password'      => Hash::make('password'),
                'role'          => 'developer',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $ismael = User::updateOrCreate(
            ['email' => 'ismael@na-innovations.be'],
            [
                'name'          => 'Ismael Bouzrouti',
                'password'      => Hash::make('password'),
                'role'          => 'developer',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        // ─── PARTNERS ───────────────────────────────────────────────────────
        $jonathanUser = User::updateOrCreate(
            ['email' => 'jonathan.bemba@gmail.com'],
            [
                'name'          => 'Jonathan Bemba',
                'password'      => Hash::make('password'),
                'role'          => 'referral_partner',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );
        $jonathan = ReferralPartner::updateOrCreate(
            ['user_id' => $jonathanUser->id],
            [
                'referral_code'           => 'JONATHAN',
                'default_commission_rate' => 20,
                'payment_method'          => 'bank_transfer',
                'is_active'               => true,
            ]
        );

        $soufianUser = User::updateOrCreate(
            ['email' => 'soufian.chourouhou@gmail.com'],
            [
                'name'          => 'Soufian Chourouhou',
                'password'      => Hash::make('password'),
                'role'          => 'referral_partner',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );
        $soufian = ReferralPartner::updateOrCreate(
            ['user_id' => $soufianUser->id],
            [
                'referral_code'           => 'SOUFIAN',
                'default_commission_rate' => 20,
                'payment_method'          => 'bank_transfer',
                'is_active'               => true,
            ]
        );

        // ─── CLIENTS ────────────────────────────────────────────────────────

        $fedrik = User::updateOrCreate(
            ['email' => 'fedrik@tiptong.be'],
            [
                'name'          => 'Fedrik De Beul',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'TipTong SRL',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $academie = User::updateOrCreate(
            ['email' => 'contact@academiecongo.com'],
            [
                'name'          => 'Académie Congo',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'Académie Congo',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $bxcars = User::updateOrCreate(
            ['email' => 'info@bxcars.be'],
            [
                'name'          => 'BX Cars',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'BX Cars',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $barbershop = User::updateOrCreate(
            ['email' => 'info@tnlbarbershop.be'],
            [
                'name'          => 'The Next Level Barbershop',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'The Next Level Barbershop',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $casabonita = User::updateOrCreate(
            ['email' => 'info@casabonitafamily.be'],
            [
                'name'          => 'Mohamed D.',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'Casa Bonita Family',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $dina = User::updateOrCreate(
            ['email' => 'info@dinakenitra.ma'],
            [
                'name'          => 'Driss Talmoust',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'Dina Kenitra',
                'country'       => 'Morocco',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $mohamedFrance = User::updateOrCreate(
            ['email' => 'mohamed@rtapoker.com'],
            [
                'name'          => 'Mohamed France',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'RTA Poker',
                'country'       => 'France',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $oussama = User::updateOrCreate(
            ['email' => 'oussama@easywed.be'],
            [
                'name'          => 'Oussama D.',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'EasyWed',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $yassine = User::updateOrCreate(
            ['email' => 'yassine@sognodoro.be'],
            [
                'name'          => 'Yassine Q.',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'Sogno D\'Oro',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        $vericoreClient = User::updateOrCreate(
            ['email' => 'info@vericore.be'],
            [
                'name'          => 'Vericore',
                'password'      => Hash::make('password'),
                'role'          => 'client',
                'company_name'  => 'Vericore',
                'is_active'     => true,
                'last_login_at' => now(),
                'approved_at'   => now()->subYear(),
            ]
        );

        // =====================================================================
        // LEADS
        // =====================================================================

        // Académie Congo -- via Jonathan Bemba -- brief_pending (waiting for client)
        $leadAcademie = Lead::updateOrCreate(
            ['email' => 'contact@academiecongo.com'],
            [
                'first_name'          => 'Académie',
                'last_name'           => 'Congo',
                'company_name'        => 'Académie Congo',
                'status'              => 'brief_pending',
                'source'              => 'referral',
                'referral_partner_id' => $jonathan->id,
                'converted_client_id' => $academie->id,
                'service_interest'    => 'Plateforme éducative avec fonctionnalités SaaS',
                'estimated_budget'    => 6000,
            ]
        );

        // Vericore -- via Soufian Chourouhou -- won (converted)
        $leadVericore = Lead::updateOrCreate(
            ['email' => 'info@vericore.be'],
            [
                'first_name'          => 'Vericore',
                'last_name'           => 'Client',
                'company_name'        => 'Vericore',
                'status'              => 'won',
                'source'              => 'referral',
                'referral_partner_id' => $soufian->id,
                'converted_client_id' => $vericoreClient->id,
                'service_interest'    => 'Site vitrine construction/bâtiment',
                'estimated_budget'    => 600,
                'won_at'              => '2025-10-01',
            ]
        );

        // TNLB -- via Soufian Chourouhou -- won (converted)
        $leadBarber = Lead::updateOrCreate(
            ['email' => 'info@tnlbarbershop.be'],
            [
                'first_name'          => 'The Next Level',
                'last_name'           => 'Barbershop',
                'company_name'        => 'The Next Level Barbershop',
                'status'              => 'won',
                'source'              => 'referral',
                'referral_partner_id' => $soufian->id,
                'converted_client_id' => $barbershop->id,
                'service_interest'    => 'Site WordPress barbershop',
                'estimated_budget'    => 700,
                'won_at'              => '2024-12-01',
            ]
        );

        // =====================================================================
        // PROJECTS
        // =====================================================================

        // 1. TipTong -- 25 000 EUR -- status: review -- dev: Nawfel + Kristian
        $projTiptong = Projet::updateOrCreate(
            ['nom_societe' => 'TipTong'],
            [
                'type_societe'          => 'Tech / Social',
                'type_site'             => 'mobile_app',
                'lieu'                  => 'Brussels',
                'client_id'             => $fedrik->id,
                'developer_id'          => $nawfel->id,
                'status'                => 'review',
                'description'           => "Plateforme de pourboire social - Application mobile (iOS/Android) + Tableau de bord web.\nPermet aux commerçants de recevoir des pourboires directement via l'application.\nÉquipe : Nawfel Ajari (lead), Kristian Vasiaj (frontend).",
                'start_date'            => '2025-02-11',
                'deadline'              => '2025-05-27',
                'budget'                => 25000,
                'lien'                  => 'www.app.tiptong.fr',
                'langage_programmation' => 'React Native + Laravel',
                'nombre_collaborateurs' => 2,
            ]
        );

        // 2. Académie Congo -- 6 000 EUR -- status: planning -- dev: Nawfel
        $projAcademie = Projet::updateOrCreate(
            ['nom_societe' => 'Académie Congo'],
            [
                'type_societe'          => 'Éducation',
                'type_site'             => 'platform_saas',
                'lieu'                  => 'Brussels',
                'client_id'             => $academie->id,
                'developer_id'          => $nawfel->id,
                'lead_id'               => $leadAcademie->id,
                'status'                => 'planning',
                'description'           => "Plateforme pour mettre en avant l'académie sur la scène africaine avec des fonctionnalités SaaS, CRUDs partout.\nEn attente de confirmation du client pour démarrer.\nLead via Jonathan Bemba (commission exception 20% = 1 200 EUR).",
                'budget'                => 6000,
                'langage_programmation' => 'Laravel + React',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 3. BX Cars -- 1 000 EUR -- status: completed -- dev: Nawfel
        $projBxcars = Projet::updateOrCreate(
            ['nom_societe' => 'BX Cars'],
            [
                'type_societe'          => 'Automobile',
                'type_site'             => 'showcase_site',
                'lieu'                  => 'Brussels',
                'client_id'             => $bxcars->id,
                'developer_id'          => $nawfel->id,
                'status'                => 'completed',
                'description'           => "Site de réservation personnalisé construit avec Laravel.\nClient direct.",
                'start_date'            => '2025-01-15',
                'end_date'              => '2025-02-15',
                'budget'                => 1000,
                'total_billed'          => 1000,
                'lien'                  => 'www.bxcars.be',
                'langage_programmation' => 'Laravel + Tailwind',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 4. The Next Level Barbershop -- 700 EUR -- status: completed -- dev: Shakil
        $projBarber = Projet::updateOrCreate(
            ['nom_societe' => 'The Next Level Barbershop'],
            [
                'type_societe'          => 'Coiffure / Barbershop',
                'type_site'             => 'showcase_site',
                'lieu'                  => 'Brussels',
                'client_id'             => $barbershop->id,
                'developer_id'          => $shakil->id,
                'lead_id'               => $leadBarber->id,
                'status'                => 'completed',
                'description'           => "Site WordPress barbershop.\nDéveloppé par Shakil Nirob (100 EUR).\nClient amené par Soufian Chourouhou (commission 140 EUR).\nHébergement payé par le client : 250 EUR/an (jan 2025, jan 2026).",
                'start_date'            => '2024-11-01',
                'end_date'              => '2024-12-15',
                'budget'                => 700,
                'total_billed'          => 700,
                'langage_programmation' => 'WordPress',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 5. Casa Bonita Family -- 820 EUR -- status: completed (site offline jan 2026)
        $projCasa = Projet::updateOrCreate(
            ['nom_societe' => 'Casa Bonita Family'],
            [
                'type_societe'          => 'Restaurant',
                'type_site'             => 'showcase_site',
                'lieu'                  => 'Brussels',
                'client_id'             => $casabonita->id,
                'developer_id'          => $shakil->id,
                'status'                => 'completed',
                'description'           => "Site vitrine restaurant.\nDéveloppé par Shakil Nirob (100 EUR).\nSite hors ligne depuis janvier 2026 -- le restaurant a fermé, le client n'a pas payé l'hébergement.\nClient direct.",
                'start_date'            => '2025-04-01',
                'end_date'              => '2025-06-15',
                'budget'                => 820,
                'total_billed'          => 820,
                'langage_programmation' => 'WordPress',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 6. Dina Kenitra Futsal Club -- 250 EUR/an -- status: completed
        $projDina = Projet::updateOrCreate(
            ['nom_societe' => 'Dina Kenitra'],
            [
                'type_societe'          => 'Sport / Futsal',
                'type_site'             => 'platform_saas',
                'lieu'                  => 'Kenitra, Morocco',
                'client_id'             => $dina->id,
                'developer_id'          => $nawfel->id,
                'status'                => 'completed',
                'description'           => "Premier site de club de futsal en Afrique, célèbre sur les réseaux sociaux avec une vraie structure de communication.\nSaaS pour club de futsal.\nHébergement 200 EUR/an payé depuis août 2024, renouvelé août 2025.\nClient direct.",
                'start_date'            => '2024-06-01',
                'end_date'              => '2024-08-01',
                'budget'                => 250,
                'total_billed'          => 250,
                'langage_programmation' => 'Laravel',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 7. RTA Poker -- 3 500 EUR/mois attendu dès mai 2026 -- status: in_progress
        $projRtaPoker = Projet::updateOrCreate(
            ['nom_societe' => 'RTA Poker'],
            [
                'type_societe'          => 'Gaming / Poker',
                'type_site'             => 'platform_saas',
                'lieu'                  => 'France',
                'client_id'             => $mohamedFrance->id,
                'developer_id'          => $nawfel->id,
                'status'                => 'in_progress',
                'description'           => "Application de poker avec revenue share.\nDéveloppé par Nawfel Ajari + Kristian Vasiaj (50/50 profits).\nRevenu attendu : 3 500 EUR/mois à partir de mai 2026.",
                'start_date'            => '2026-02-01',
                'budget'                => 3500,
                'langage_programmation' => 'Laravel + React',
                'nombre_collaborateurs' => 2,
            ]
        );

        // 8. EasyWed -- 2 600 EUR -- status: completed -- dev: Shakil
        $projEasywed = Projet::updateOrCreate(
            ['nom_societe' => 'EasyWed'],
            [
                'type_societe'          => 'Mariage / Événementiel',
                'type_site'             => 'mobile_app',
                'lieu'                  => 'Brussels',
                'client_id'             => $oussama->id,
                'developer_id'          => $shakil->id,
                'status'                => 'completed',
                'description'           => "Application mobile pour connecter les prestataires de services de mariage avec les clients.\nComptes premium avec paiements.\nDéveloppé par Shakil Nirob (1 200 EUR).\nClient direct.",
                'start_date'            => '2025-06-01',
                'end_date'              => '2025-09-30',
                'budget'                => 2600,
                'total_billed'          => 2600,
                'langage_programmation' => 'React Native + Laravel',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 9. Sogno D'Oro -- 1 800 EUR -- status: completed depuis nov 2025
        $projSognodoro = Projet::updateOrCreate(
            ['nom_societe' => 'Sogno D\'Oro'],
            [
                'type_societe'          => 'E-commerce / Parfumerie',
                'type_site'             => 'ecommerce',
                'lieu'                  => 'Brussels',
                'client_id'             => $yassine->id,
                'developer_id'          => $nawfel->id,
                'status'                => 'completed',
                'description'           => "Site e-commerce de parfumerie construit sur mesure avec Laravel + React.\nDéveloppé par Nawfel Ajari + Kristian Vasiaj (50/50).\nHébergement 250 EUR/an.\nClient direct.",
                'start_date'            => '2025-08-01',
                'end_date'              => '2025-11-01',
                'budget'                => 1800,
                'total_billed'          => 1800,
                'langage_programmation' => 'Laravel + React',
                'nombre_collaborateurs' => 2,
            ]
        );

        // 10. Vericore -- 600 EUR + 200 EUR hébergement -- status: completed
        $projVericore = Projet::updateOrCreate(
            ['nom_societe' => 'Vericore'],
            [
                'type_societe'          => 'Construction / Bâtiment',
                'type_site'             => 'showcase_site',
                'lieu'                  => 'Brussels',
                'client_id'             => $vericoreClient->id,
                'developer_id'          => $nawfel->id,
                'lead_id'               => $leadVericore->id,
                'status'                => 'completed',
                'description'           => "Site vitrine construction/bâtiment.\nClient trouvé par Soufian Chourouhou (commission 20%).\nHébergement 200 EUR/an.",
                'start_date'            => '2025-09-01',
                'end_date'              => '2025-10-15',
                'budget'                => 600,
                'total_billed'          => 600,
                'langage_programmation' => 'Laravel + Tailwind',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 11. Cabs -- 0 EUR (interne) -- status: in_progress
        $projCabs = Projet::updateOrCreate(
            ['nom_societe' => 'Cabs'],
            [
                'type_societe'          => 'Transport / Taxi',
                'type_site'             => 'mobile_app',
                'lieu'                  => 'Brussels',
                'developer_id'          => $nawfel->id,
                'status'                => 'in_progress',
                'description'           => "Produit interne -- SaaS de gestion de flotte de taxis.\nDéveloppé par Nawfel Ajari, Kristian Vasiaj, Ismael Bouzrouti.",
                'start_date'            => '2025-09-01',
                'deadline'              => '2026-06-01',
                'budget'                => 0,
                'langage_programmation' => 'Laravel + React Native',
                'nombre_collaborateurs' => 3,
            ]
        );

        // 12. ClubManager -- 0 EUR (interne) -- status: in_progress
        $projClubManager = Projet::updateOrCreate(
            ['nom_societe' => 'ClubManager'],
            [
                'type_societe'          => 'Sport / SaaS',
                'type_site'             => 'platform_saas',
                'lieu'                  => 'Brussels',
                'developer_id'          => $nawfel->id,
                'status'                => 'in_progress',
                'description'           => "Produit interne basé sur le code de Dina Kenitra.\nSaaS pour clubs de football/futsal.\nDéveloppé par Nawfel Ajari.",
                'start_date'            => '2025-10-01',
                'budget'                => 0,
                'langage_programmation' => 'Laravel + React',
                'nombre_collaborateurs' => 1,
            ]
        );

        // 13. RestoConnect -- 0 EUR (interne) -- status: in_progress
        $projRestoConnect = Projet::updateOrCreate(
            ['nom_societe' => 'RestoConnect'],
            [
                'type_societe'          => 'Restauration / SaaS',
                'type_site'             => 'platform_saas',
                'lieu'                  => 'Brussels',
                'developer_id'          => $nawfel->id,
                'status'                => 'in_progress',
                'description'           => "Produit interne -- SaaS pour restaurants avec menu et réservations.\nDéveloppé par Nawfel Ajari.",
                'start_date'            => '2025-11-01',
                'budget'                => 0,
                'langage_programmation' => 'Laravel + React',
                'nombre_collaborateurs' => 1,
            ]
        );

        // =====================================================================
        // QUOTES
        // =====================================================================

        // DEV-2026-001 -- TipTong -- 25 000 EUR -- accepted
        $quoteTiptong = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-001'],
            [
                'client_id'            => $fedrik->id,
                'projet_id'            => $projTiptong->id,
                'client_name'          => 'Fedrik De Beul',
                'client_email'         => 'fedrik@tiptong.be',
                'client_company'       => 'TipTong SRL',
                'title'                => 'TipTong - Application Mobile + Plateforme Web',
                'introduction'         => "Cher Fedrik,\n\nSuite à notre rencontre, nous avons le plaisir de vous présenter notre proposition pour la plateforme de pourboire social TipTong, incluant l'application mobile (iOS & Android) et le tableau de bord web.",
                'scope_of_work'        => "- Application mobile (React Native) pour iOS et Android\n- Tableau de bord web pour commerçants et administrateurs\n- Intégration paiement (Stripe)\n- Notifications push\n- Authentification et profils utilisateurs\n- Tableau de bord analytique",
                'exclusions'           => "- Frais de compte développeur App Store / Google Play\n- Coûts API tiers (frais Stripe)\n- Création de contenu et rédaction",
                'terms_and_conditions' => "- Acompte de 30% requis avant le début du projet\n- Paiement final à la livraison\n- Période de révision de 30 jours après livraison\n- Propriété du code source transférée après paiement complet",
                'subtotal'             => 20661.16,
                'tax_rate'             => 21,
                'tax_amount'           => 4338.84,
                'total'                => 25000,
                'deposit_percentage'   => 30,
                'deposit_amount'       => 7500,
                'status'               => 'accepted',
                'accepted_at'          => '2025-02-05',
                'issue_date'           => '2025-02-01',
                'valid_until'          => '2025-03-01',
                'sent_at'              => '2025-02-02',
                'viewed_at'            => '2025-02-03',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'Design UX/UI - Application Mobile'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 3500, 'total' => 3500, 'sort_order' => 0]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'Développement Application Mobile (React Native)'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 12000, 'total' => 12000, 'sort_order' => 1]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'Tableau de bord Web (Laravel + React)'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 5161.16, 'total' => 5161.16, 'sort_order' => 2]
        );

        // DEV-2026-002 -- Académie Congo -- 6 000 EUR -- sent
        $quoteAcademie = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-002'],
            [
                'client_id'            => $academie->id,
                'projet_id'            => $projAcademie->id,
                'client_name'          => 'Académie Congo',
                'client_email'         => 'contact@academiecongo.com',
                'client_company'       => 'Académie Congo',
                'title'                => 'Académie Congo - Plateforme SaaS Éducative',
                'introduction'         => "Proposition pour la création d'une plateforme éducative mettant en avant l'académie sur la scène africaine avec des fonctionnalités SaaS complètes.",
                'scope_of_work'        => "- Plateforme web complète avec CRUDs\n- Gestion des étudiants et des cours\n- Tableau de bord administrateur\n- Intégration paiement",
                'subtotal'             => 4958.68,
                'tax_rate'             => 21,
                'tax_amount'           => 1041.32,
                'total'                => 6000,
                'deposit_percentage'   => 30,
                'deposit_amount'       => 1800,
                'status'               => 'sent',
                'issue_date'           => '2026-03-01',
                'valid_until'          => '2026-04-01',
                'sent_at'              => '2026-03-02',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteAcademie->id, 'description' => 'Développement plateforme SaaS éducative'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 4958.68, 'total' => 4958.68, 'sort_order' => 0]
        );

        // DEV-2026-003 -- BX Cars -- 1 000 EUR -- accepted
        $quoteBxcars = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-003'],
            [
                'client_id'            => $bxcars->id,
                'projet_id'            => $projBxcars->id,
                'client_name'          => 'BX Cars',
                'client_email'         => 'info@bxcars.be',
                'client_company'       => 'BX Cars',
                'title'                => 'BX Cars - Site de réservation',
                'subtotal'             => 826.45,
                'tax_rate'             => 21,
                'tax_amount'           => 173.55,
                'total'                => 1000,
                'status'               => 'accepted',
                'accepted_at'          => '2025-01-10',
                'issue_date'           => '2025-01-05',
                'valid_until'          => '2025-02-05',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteBxcars->id, 'description' => 'Développement site de réservation Laravel'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 826.45, 'total' => 826.45, 'sort_order' => 0]
        );

        // DEV-2026-004 -- TNLB -- 700 EUR -- accepted
        $quoteBarber = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-004'],
            [
                'client_id'            => $barbershop->id,
                'projet_id'            => $projBarber->id,
                'client_name'          => 'The Next Level Barbershop',
                'client_email'         => 'info@tnlbarbershop.be',
                'client_company'       => 'The Next Level Barbershop',
                'title'                => 'TNLB - Site WordPress Barbershop',
                'subtotal'             => 578.51,
                'tax_rate'             => 21,
                'tax_amount'           => 121.49,
                'total'                => 700,
                'status'               => 'accepted',
                'accepted_at'          => '2024-10-20',
                'issue_date'           => '2024-10-15',
                'valid_until'          => '2024-11-15',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteBarber->id, 'description' => 'Développement site WordPress barbershop'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 578.51, 'total' => 578.51, 'sort_order' => 0]
        );

        // DEV-2026-005 -- Casa Bonita -- 820 EUR -- accepted
        $quoteCasa = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-005'],
            [
                'client_id'            => $casabonita->id,
                'projet_id'            => $projCasa->id,
                'client_name'          => 'Mohamed D.',
                'client_email'         => 'info@casabonitafamily.be',
                'client_company'       => 'Casa Bonita Family',
                'title'                => 'Casa Bonita Family - Site vitrine restaurant',
                'subtotal'             => 677.69,
                'tax_rate'             => 21,
                'tax_amount'           => 142.31,
                'total'                => 820,
                'status'               => 'accepted',
                'accepted_at'          => '2025-03-25',
                'issue_date'           => '2025-03-20',
                'valid_until'          => '2025-04-20',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteCasa->id, 'description' => 'Développement site vitrine restaurant'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 677.69, 'total' => 677.69, 'sort_order' => 0]
        );

        // DEV-2026-006 -- Dina Kenitra -- 250 EUR -- accepted
        $quoteDina = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-006'],
            [
                'client_id'            => $dina->id,
                'projet_id'            => $projDina->id,
                'client_name'          => 'Driss Talmoust',
                'client_email'         => 'info@dinakenitra.ma',
                'client_company'       => 'Dina Kenitra',
                'title'                => 'Dina Kenitra - Plateforme SaaS club futsal',
                'subtotal'             => 206.61,
                'tax_rate'             => 21,
                'tax_amount'           => 43.39,
                'total'                => 250,
                'status'               => 'accepted',
                'accepted_at'          => '2024-05-20',
                'issue_date'           => '2024-05-15',
                'valid_until'          => '2024-06-15',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteDina->id, 'description' => 'Développement plateforme SaaS futsal'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 206.61, 'total' => 206.61, 'sort_order' => 0]
        );

        // DEV-2026-007 -- RTA Poker -- 3 500 EUR/mois -- accepted
        $quoteRtaPoker = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-007'],
            [
                'client_id'            => $mohamedFrance->id,
                'projet_id'            => $projRtaPoker->id,
                'client_name'          => 'Mohamed France',
                'client_email'         => 'mohamed@rtapoker.com',
                'client_company'       => 'RTA Poker',
                'title'                => 'RTA Poker - Application de poker avec revenue share',
                'notes'                => 'Revenue share mensuel de 3 500 EUR/mois attendu à partir de mai 2026.',
                'subtotal'             => 2892.56,
                'tax_rate'             => 21,
                'tax_amount'           => 607.44,
                'total'                => 3500,
                'status'               => 'accepted',
                'accepted_at'          => '2026-01-25',
                'issue_date'           => '2026-01-20',
                'valid_until'          => '2026-02-20',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteRtaPoker->id, 'description' => 'Revenue share mensuel - Application poker'],
            ['quantity' => 1, 'unit' => 'mois', 'unit_price' => 2892.56, 'total' => 2892.56, 'sort_order' => 0]
        );

        // DEV-2026-008 -- EasyWed -- 2 600 EUR -- accepted
        $quoteEasywed = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-008'],
            [
                'client_id'            => $oussama->id,
                'projet_id'            => $projEasywed->id,
                'client_name'          => 'Oussama D.',
                'client_email'         => 'oussama@easywed.be',
                'client_company'       => 'EasyWed',
                'title'                => 'EasyWed - Application mobile mariage',
                'subtotal'             => 2148.76,
                'tax_rate'             => 21,
                'tax_amount'           => 451.24,
                'total'                => 2600,
                'status'               => 'accepted',
                'accepted_at'          => '2025-05-25',
                'issue_date'           => '2025-05-20',
                'valid_until'          => '2025-06-20',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteEasywed->id, 'description' => 'Développement application mobile mariage'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 2148.76, 'total' => 2148.76, 'sort_order' => 0]
        );

        // DEV-2026-009 -- Sogno D'Oro -- 1 800 EUR -- accepted
        $quoteSognodoro = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-009'],
            [
                'client_id'            => $yassine->id,
                'projet_id'            => $projSognodoro->id,
                'client_name'          => 'Yassine Q.',
                'client_email'         => 'yassine@sognodoro.be',
                'client_company'       => 'Sogno D\'Oro',
                'title'                => 'Sogno D\'Oro - Site e-commerce parfumerie',
                'subtotal'             => 1487.60,
                'tax_rate'             => 21,
                'tax_amount'           => 312.40,
                'total'                => 1800,
                'status'               => 'accepted',
                'accepted_at'          => '2025-07-25',
                'issue_date'           => '2025-07-20',
                'valid_until'          => '2025-08-20',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteSognodoro->id, 'description' => 'Développement site e-commerce parfumerie'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 1487.60, 'total' => 1487.60, 'sort_order' => 0]
        );

        // DEV-2026-010 -- Vericore -- 600 EUR -- accepted
        $quoteVericore = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-010'],
            [
                'client_id'            => $vericoreClient->id,
                'projet_id'            => $projVericore->id,
                'client_name'          => 'Vericore',
                'client_email'         => 'info@vericore.be',
                'client_company'       => 'Vericore',
                'title'                => 'Vericore - Site vitrine construction',
                'subtotal'             => 495.87,
                'tax_rate'             => 21,
                'tax_amount'           => 104.13,
                'total'                => 600,
                'status'               => 'accepted',
                'accepted_at'          => '2025-08-25',
                'issue_date'           => '2025-08-20',
                'valid_until'          => '2025-09-20',
                'view_token'           => Str::random(64),
                'locale'               => 'fr',
            ]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteVericore->id, 'description' => 'Développement site vitrine construction'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 495.87, 'total' => 495.87, 'sort_order' => 0]
        );

        // =====================================================================
        // INVOICES (deposit invoices for completed/paid projects)
        // =====================================================================

        // FAC-2026-001 -- TipTong deposit 30%
        $invTiptong = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-001'],
            [
                'quote_id'       => $quoteTiptong->id,
                'client_id'      => $fedrik->id,
                'projet_id'      => $projTiptong->id,
                'client_name'    => 'Fedrik De Beul',
                'client_email'   => 'fedrik@tiptong.be',
                'client_company' => 'TipTong SRL',
                'title'          => 'Acompte - TipTong',
                'type'           => 'deposit',
                'subtotal'       => 6198.35,
                'tax_rate'       => 21,
                'tax_amount'     => 1301.65,
                'total'          => 7500,
                'amount_paid'    => 7500,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-02-10',
                'due_date'       => '2025-03-10',
                'paid_at'        => '2025-02-12',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invTiptong->id, 'description' => 'Acompte (30%) - TipTong Application Mobile + Plateforme Web'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 6198.35, 'total' => 6198.35, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invTiptong->id, 'reference' => 'TIPTONG-DEP-001'],
            [
                'client_id'    => $fedrik->id,
                'amount'       => 7500,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-02-12',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-002 -- BX Cars full payment
        $invBxcars = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-002'],
            [
                'quote_id'       => $quoteBxcars->id,
                'client_id'      => $bxcars->id,
                'projet_id'      => $projBxcars->id,
                'client_name'    => 'BX Cars',
                'client_email'   => 'info@bxcars.be',
                'client_company' => 'BX Cars',
                'title'          => 'Facture finale - BX Cars',
                'type'           => 'final',
                'subtotal'       => 826.45,
                'tax_rate'       => 21,
                'tax_amount'     => 173.55,
                'total'          => 1000,
                'amount_paid'    => 1000,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-02-15',
                'due_date'       => '2025-03-15',
                'paid_at'        => '2025-02-20',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invBxcars->id, 'description' => 'Site de réservation BX Cars'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 826.45, 'total' => 826.45, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invBxcars->id, 'reference' => 'BXCARS-001'],
            [
                'client_id'    => $bxcars->id,
                'amount'       => 1000,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-02-20',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-003 -- TNLB full payment
        $invBarber = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-003'],
            [
                'quote_id'       => $quoteBarber->id,
                'client_id'      => $barbershop->id,
                'projet_id'      => $projBarber->id,
                'client_name'    => 'The Next Level Barbershop',
                'client_email'   => 'info@tnlbarbershop.be',
                'client_company' => 'The Next Level Barbershop',
                'title'          => 'Facture finale - TNLB',
                'type'           => 'final',
                'subtotal'       => 578.51,
                'tax_rate'       => 21,
                'tax_amount'     => 121.49,
                'total'          => 700,
                'amount_paid'    => 700,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2024-12-15',
                'due_date'       => '2025-01-15',
                'paid_at'        => '2024-12-20',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invBarber->id, 'description' => 'Site WordPress TNLB'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 578.51, 'total' => 578.51, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invBarber->id, 'reference' => 'TNLB-001'],
            [
                'client_id'    => $barbershop->id,
                'amount'       => 700,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2024-12-20',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-004 -- Casa Bonita full payment
        $invCasa = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-004'],
            [
                'quote_id'       => $quoteCasa->id,
                'client_id'      => $casabonita->id,
                'projet_id'      => $projCasa->id,
                'client_name'    => 'Mohamed D.',
                'client_email'   => 'info@casabonitafamily.be',
                'client_company' => 'Casa Bonita Family',
                'title'          => 'Facture finale - Casa Bonita Family',
                'type'           => 'final',
                'subtotal'       => 677.69,
                'tax_rate'       => 21,
                'tax_amount'     => 142.31,
                'total'          => 820,
                'amount_paid'    => 820,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-06-15',
                'due_date'       => '2025-07-15',
                'paid_at'        => '2025-06-20',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invCasa->id, 'description' => 'Site vitrine restaurant Casa Bonita'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 677.69, 'total' => 677.69, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invCasa->id, 'reference' => 'CASABONITA-001'],
            [
                'client_id'    => $casabonita->id,
                'amount'       => 820,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-06-20',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-005 -- Dina Kenitra
        $invDina = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-005'],
            [
                'quote_id'       => $quoteDina->id,
                'client_id'      => $dina->id,
                'projet_id'      => $projDina->id,
                'client_name'    => 'Driss Talmoust',
                'client_email'   => 'info@dinakenitra.ma',
                'client_company' => 'Dina Kenitra',
                'title'          => 'Facture - Dina Kenitra',
                'type'           => 'final',
                'subtotal'       => 206.61,
                'tax_rate'       => 21,
                'tax_amount'     => 43.39,
                'total'          => 250,
                'amount_paid'    => 250,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2024-08-01',
                'due_date'       => '2024-09-01',
                'paid_at'        => '2024-08-05',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invDina->id, 'description' => 'Plateforme SaaS club futsal Dina Kenitra'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 206.61, 'total' => 206.61, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invDina->id, 'reference' => 'DINA-001'],
            [
                'client_id'    => $dina->id,
                'amount'       => 250,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2024-08-05',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-006 -- EasyWed full payment
        $invEasywed = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-006'],
            [
                'quote_id'       => $quoteEasywed->id,
                'client_id'      => $oussama->id,
                'projet_id'      => $projEasywed->id,
                'client_name'    => 'Oussama D.',
                'client_email'   => 'oussama@easywed.be',
                'client_company' => 'EasyWed',
                'title'          => 'Facture finale - EasyWed',
                'type'           => 'final',
                'subtotal'       => 2148.76,
                'tax_rate'       => 21,
                'tax_amount'     => 451.24,
                'total'          => 2600,
                'amount_paid'    => 2600,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-09-30',
                'due_date'       => '2025-10-30',
                'paid_at'        => '2025-10-05',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invEasywed->id, 'description' => 'Application mobile mariage EasyWed'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 2148.76, 'total' => 2148.76, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invEasywed->id, 'reference' => 'EASYWED-001'],
            [
                'client_id'    => $oussama->id,
                'amount'       => 2600,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-10-05',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-007 -- Sogno D'Oro full payment
        $invSognodoro = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-007'],
            [
                'quote_id'       => $quoteSognodoro->id,
                'client_id'      => $yassine->id,
                'projet_id'      => $projSognodoro->id,
                'client_name'    => 'Yassine Q.',
                'client_email'   => 'yassine@sognodoro.be',
                'client_company' => 'Sogno D\'Oro',
                'title'          => 'Facture finale - Sogno D\'Oro',
                'type'           => 'final',
                'subtotal'       => 1487.60,
                'tax_rate'       => 21,
                'tax_amount'     => 312.40,
                'total'          => 1800,
                'amount_paid'    => 1800,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-11-01',
                'due_date'       => '2025-12-01',
                'paid_at'        => '2025-11-05',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invSognodoro->id, 'description' => 'Site e-commerce parfumerie Sogno D\'Oro'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 1487.60, 'total' => 1487.60, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invSognodoro->id, 'reference' => 'SOGNODORO-001'],
            [
                'client_id'    => $yassine->id,
                'amount'       => 1800,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-11-05',
                'status'       => 'confirmed',
            ]
        );

        // FAC-2026-008 -- Vericore full payment
        $invVericore = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-008'],
            [
                'quote_id'       => $quoteVericore->id,
                'client_id'      => $vericoreClient->id,
                'projet_id'      => $projVericore->id,
                'client_name'    => 'Vericore',
                'client_email'   => 'info@vericore.be',
                'client_company' => 'Vericore',
                'title'          => 'Facture finale - Vericore',
                'type'           => 'final',
                'subtotal'       => 495.87,
                'tax_rate'       => 21,
                'tax_amount'     => 104.13,
                'total'          => 600,
                'amount_paid'    => 600,
                'amount_due'     => 0,
                'status'         => 'paid',
                'issue_date'     => '2025-10-15',
                'due_date'       => '2025-11-15',
                'paid_at'        => '2025-10-20',
                'view_token'     => Str::random(64),
                'locale'         => 'fr',
            ]
        );
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invVericore->id, 'description' => 'Site vitrine construction Vericore'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 495.87, 'total' => 495.87, 'sort_order' => 0]
        );
        Payment::updateOrCreate(
            ['invoice_id' => $invVericore->id, 'reference' => 'VERICORE-001'],
            [
                'client_id'    => $vericoreClient->id,
                'amount'       => 600,
                'currency'     => 'EUR',
                'method'       => 'bank_transfer',
                'payment_date' => '2025-10-20',
                'status'       => 'confirmed',
            ]
        );

        // =====================================================================
        // COMMISSIONS
        // =====================================================================

        // Jonathan Bemba -- 20% on Académie Congo (6 000 * 20% = 1 200 EUR) -- estimated
        Commission::updateOrCreate(
            ['lead_id' => $leadAcademie->id, 'referral_partner_id' => $jonathan->id],
            [
                'client_id'         => $academie->id,
                'projet_id'         => $projAcademie->id,
                'base_amount'       => 6000,
                'commission_rate'   => 20,
                'commission_amount' => 1200,
                'status'            => 'estimated',
                'notes'             => 'Commission exception 20% -- projet pas encore démarré.',
            ]
        );

        // Soufian Chourouhou -- 20% on Vericore (600 * 20% = 120 EUR) -- paid
        Commission::updateOrCreate(
            ['lead_id' => $leadVericore->id, 'referral_partner_id' => $soufian->id],
            [
                'client_id'         => $vericoreClient->id,
                'projet_id'         => $projVericore->id,
                'base_amount'       => 600,
                'commission_rate'   => 20,
                'commission_amount' => 120,
                'status'            => 'paid',
                'paid_date'         => '2025-10-25',
                'payment_reference' => 'COMM-VC-001',
            ]
        );

        // Soufian Chourouhou -- commission on TNLB = 140 EUR -- paid
        Commission::updateOrCreate(
            ['lead_id' => $leadBarber->id, 'referral_partner_id' => $soufian->id],
            [
                'client_id'         => $barbershop->id,
                'projet_id'         => $projBarber->id,
                'base_amount'       => 700,
                'commission_rate'   => 20,
                'commission_amount' => 140,
                'status'            => 'paid',
                'paid_date'         => '2024-12-25',
                'payment_reference' => 'COMM-TNLB-001',
            ]
        );

        // =====================================================================
        // RECURRING SERVICES (hosting)
        // =====================================================================

        // TNLB hosting -- 250 EUR/an -- paid Jan 2025, renewal Jan 2026
        RecurringService::updateOrCreate(
            ['name' => 'Hébergement + Domaine - TNLB'],
            [
                'client_id'     => $barbershop->id,
                'projet_id'     => $projBarber->id,
                'type'          => 'hosting',
                'provider'      => 'NA Innovations',
                'frequency'     => 'annual',
                'purchase_date' => '2025-01-01',
                'expiry_date'   => '2026-01-01',
                'real_cost'     => 40,
                'billed_price'  => 250,
                'status'        => 'active',
                'auto_renew'    => true,
                'description'   => 'Hébergement web + nom de domaine pour le site TNLB. Payé en janvier 2025, renouvellement janvier 2026.',
            ]
        );

        // Dina Kenitra hosting -- 200 EUR/an -- paid Aug 2024, renewal Aug 2025
        RecurringService::updateOrCreate(
            ['name' => 'Hébergement + Domaine - Dina Kenitra'],
            [
                'client_id'     => $dina->id,
                'projet_id'     => $projDina->id,
                'type'          => 'hosting',
                'provider'      => 'NA Innovations',
                'frequency'     => 'annual',
                'purchase_date' => '2024-08-01',
                'expiry_date'   => '2025-08-01',
                'real_cost'     => 40,
                'billed_price'  => 200,
                'status'        => 'active',
                'auto_renew'    => true,
                'description'   => 'Hébergement web + nom de domaine pour le site Dina Kenitra. Payé août 2024, renouvelé août 2025.',
            ]
        );

        // Sogno D'Oro hosting -- 250 EUR/an -- since Nov 2025
        RecurringService::updateOrCreate(
            ['name' => 'Hébergement + Domaine - Sogno D\'Oro'],
            [
                'client_id'     => $yassine->id,
                'projet_id'     => $projSognodoro->id,
                'type'          => 'hosting',
                'provider'      => 'NA Innovations',
                'frequency'     => 'annual',
                'purchase_date' => '2025-11-01',
                'expiry_date'   => '2026-11-01',
                'real_cost'     => 40,
                'billed_price'  => 250,
                'status'        => 'active',
                'auto_renew'    => true,
                'description'   => 'Hébergement web + nom de domaine pour le site e-commerce Sogno D\'Oro.',
            ]
        );

        // Vericore hosting -- 200 EUR/an
        RecurringService::updateOrCreate(
            ['name' => 'Hébergement + Domaine - Vericore'],
            [
                'client_id'     => $vericoreClient->id,
                'projet_id'     => $projVericore->id,
                'type'          => 'hosting',
                'provider'      => 'NA Innovations',
                'frequency'     => 'annual',
                'purchase_date' => '2025-10-15',
                'expiry_date'   => '2026-10-15',
                'real_cost'     => 40,
                'billed_price'  => 200,
                'status'        => 'active',
                'auto_renew'    => true,
                'description'   => 'Hébergement web + nom de domaine pour le site Vericore.',
            ]
        );

        // Casa Bonita hosting -- 250 EUR/an -- EXPIRED Jan 2026 -- auto_renew false
        RecurringService::updateOrCreate(
            ['name' => 'Hébergement + Domaine - Casa Bonita Family'],
            [
                'client_id'     => $casabonita->id,
                'projet_id'     => $projCasa->id,
                'type'          => 'hosting',
                'provider'      => 'NA Innovations',
                'frequency'     => 'annual',
                'purchase_date' => '2025-01-01',
                'expiry_date'   => '2026-01-01',
                'real_cost'     => 40,
                'billed_price'  => 250,
                'status'        => 'expired',
                'auto_renew'    => false,
                'description'   => 'Hébergement web + nom de domaine. Expiré janvier 2026 -- le restaurant a fermé, le client n\'a pas payé le renouvellement. Site hors ligne.',
            ]
        );

        // =====================================================================
        // BUDGET LINES (revenue projections)
        // =====================================================================

        // RTA Poker -- 3 500 EUR/mois income from May 2026
        ProjectBudgetLine::updateOrCreate(
            ['project_id' => $projRtaPoker->id, 'label' => 'Revenue share mensuel'],
            ['type' => 'income', 'amount' => 3500.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-05-01', 'is_confirmed' => false, 'notes' => 'Revenu attendu de 3 500 EUR/mois à partir de mai 2026 -- non confirmé.']
        );

        // Académie Congo -- 100 EUR/mois maintenance from completion
        ProjectBudgetLine::updateOrCreate(
            ['project_id' => $projAcademie->id, 'label' => 'Maintenance mensuelle'],
            ['type' => 'income', 'amount' => 100.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-06-01', 'is_confirmed' => false, 'notes' => 'Contrat maintenance mensuel après livraison du projet.']
        );

        // EasyWed -- 150 EUR/mois from May 2026
        ProjectBudgetLine::updateOrCreate(
            ['project_id' => $projEasywed->id, 'label' => 'Abonnement mensuel client'],
            ['type' => 'income', 'amount' => 150.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-05-01', 'is_confirmed' => false, 'notes' => 'Revenu récurrent post-livraison.']
        );

        // TipTong -- 2 000 EUR/mois revenue share from Jun 2026
        ProjectBudgetLine::updateOrCreate(
            ['project_id' => $projTiptong->id, 'label' => 'Revenue share mensuel'],
            ['type' => 'income', 'amount' => 2000.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-06-01', 'is_confirmed' => false, 'notes' => 'Revenue share après lancement.']
        );

        // Cabs -- 250 EUR/mois par client (projected)
        ProjectBudgetLine::updateOrCreate(
            ['project_id' => $projCabs->id, 'label' => 'Abonnement mensuel par client'],
            ['type' => 'income', 'amount' => 250.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-07-01', 'is_confirmed' => false, 'notes' => '250 EUR/mois par client -- projection.']
        );

        // =====================================================================
        // DEVELOPER PAYOUTS
        // =====================================================================

        // TipTong -- Kristian 12 500 EUR
        ProjectPayout::updateOrCreate(
            ['project_id' => $projTiptong->id, 'user_id' => $kristian->id],
            [
                'role'           => 'developer',
                'amount'         => 12500,
                'status'         => 'paid',
                'paid_date'      => '2025-05-01',
                'payment_method' => 'bank_transfer',
                'notes'          => 'Part Kristian Vasiaj -- TipTong (50/50 avec Nawfel).',
            ]
        );

        // TipTong -- Nawfel 12 500 EUR
        ProjectPayout::updateOrCreate(
            ['project_id' => $projTiptong->id, 'user_id' => $nawfel->id],
            [
                'role'           => 'admin',
                'amount'         => 12500,
                'status'         => 'paid',
                'paid_date'      => '2025-05-01',
                'payment_method' => 'bank_transfer',
                'notes'          => 'Part Nawfel Ajari -- TipTong.',
            ]
        );

        // TNLB -- Shakil 100 EUR
        ProjectPayout::updateOrCreate(
            ['project_id' => $projBarber->id, 'user_id' => $shakil->id],
            [
                'role'           => 'developer',
                'amount'         => 100,
                'status'         => 'paid',
                'paid_date'      => '2024-12-20',
                'payment_method' => 'cash',
                'notes'          => 'Part Shakil Nirob -- TNLB.',
            ]
        );

        // Casa Bonita -- Shakil 100 EUR
        ProjectPayout::updateOrCreate(
            ['project_id' => $projCasa->id, 'user_id' => $shakil->id],
            [
                'role'           => 'developer',
                'amount'         => 100,
                'status'         => 'paid',
                'paid_date'      => '2025-06-20',
                'payment_method' => 'cash',
                'notes'          => 'Part Shakil Nirob -- Casa Bonita.',
            ]
        );

        // EasyWed -- Shakil 1 200 EUR
        ProjectPayout::updateOrCreate(
            ['project_id' => $projEasywed->id, 'user_id' => $shakil->id],
            [
                'role'           => 'developer',
                'amount'         => 1200,
                'status'         => 'paid',
                'paid_date'      => '2025-10-05',
                'payment_method' => 'bank_transfer',
                'notes'          => 'Part Shakil Nirob -- EasyWed.',
            ]
        );

        // Sogno D'Oro -- Kristian 900 EUR (50/50 of 1 800)
        ProjectPayout::updateOrCreate(
            ['project_id' => $projSognodoro->id, 'user_id' => $kristian->id],
            [
                'role'           => 'developer',
                'amount'         => 900,
                'status'         => 'paid',
                'paid_date'      => '2025-11-10',
                'payment_method' => 'bank_transfer',
                'notes'          => 'Part Kristian Vasiaj -- Sogno D\'Oro (50/50 avec Nawfel).',
            ]
        );

        // Sogno D'Oro -- Nawfel 900 EUR (50/50 of 1 800)
        ProjectPayout::updateOrCreate(
            ['project_id' => $projSognodoro->id, 'user_id' => $nawfel->id],
            [
                'role'           => 'admin',
                'amount'         => 900,
                'status'         => 'paid',
                'paid_date'      => '2025-11-10',
                'payment_method' => 'bank_transfer',
                'notes'          => 'Part Nawfel Ajari -- Sogno D\'Oro (50/50 avec Kristian).',
            ]
        );

        // =====================================================================
        // PORTFOLIO
        // =====================================================================

        // TipTong -- featured
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projTiptong->id],
            [
                'title'           => 'TipTong',
                'client_name'     => 'TipTong SRL',
                'excerpt'         => 'Plateforme de pourboire social avec application mobile iOS/Android et tableau de bord web.',
                'context'         => 'TipTong est une plateforme innovante permettant aux commerçants de recevoir des pourboires directement via une application mobile.',
                'challenge'       => 'Créer une expérience utilisateur fluide pour les pourboires numériques avec intégration Stripe Connect pour les paiements en temps réel.',
                'solution'        => 'Application React Native avec backend Laravel, intégration Stripe Connect, notifications push et tableau de bord analytique.',
                'tech_stack'      => ['React Native', 'Laravel', 'Stripe', 'PostgreSQL'],
                'features'        => ['Application mobile iOS/Android', 'Tableau de bord commerçants', 'Paiements Stripe Connect', 'Notifications push', 'Analytique'],
                'tags'            => ['mobile', 'fintech', 'react-native', 'laravel'],
                'live_url'        => 'www.app.tiptong.fr',
                'category'        => 'mobile_app',
                'completion_date' => '2025-05-27',
                'is_published'    => true,
                'is_featured'     => true,
                'sort_order'      => 1,
            ]
        );

        // BX Cars
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projBxcars->id],
            [
                'title'           => 'BX Cars',
                'client_name'     => 'BX Cars',
                'excerpt'         => 'Site de réservation personnalisé pour concessionnaire automobile.',
                'context'         => 'BX Cars avait besoin d\'un site web professionnel avec un système de réservation intégré.',
                'solution'        => 'Site Laravel sur mesure avec système de réservation, catalogue de véhicules et formulaire de contact.',
                'tech_stack'      => ['Laravel', 'Tailwind CSS', 'MySQL'],
                'features'        => ['Catalogue de véhicules', 'Système de réservation', 'Formulaire de contact'],
                'tags'            => ['web', 'automobile', 'laravel'],
                'live_url'        => 'www.bxcars.be',
                'category'        => 'showcase_site',
                'completion_date' => '2025-02-15',
                'is_published'    => true,
                'is_featured'     => false,
                'sort_order'      => 3,
            ]
        );

        // EasyWed
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projEasywed->id],
            [
                'title'           => 'EasyWed',
                'client_name'     => 'EasyWed',
                'excerpt'         => 'Application mobile pour connecter les prestataires de mariage avec les clients.',
                'context'         => 'EasyWed facilite la mise en relation entre prestataires de services de mariage et couples à la recherche de services.',
                'solution'        => 'Application React Native avec comptes premium, système de paiement et mise en relation intelligente.',
                'tech_stack'      => ['React Native', 'Laravel', 'Stripe'],
                'features'        => ['Mise en relation prestataires/clients', 'Comptes premium', 'Paiements intégrés', 'Profils détaillés'],
                'tags'            => ['mobile', 'mariage', 'marketplace'],
                'category'        => 'mobile_app',
                'completion_date' => '2025-09-30',
                'is_published'    => true,
                'is_featured'     => false,
                'sort_order'      => 4,
            ]
        );

        // Sogno D'Oro
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projSognodoro->id],
            [
                'title'           => 'Sogno D\'Oro',
                'client_name'     => 'Sogno D\'Oro',
                'excerpt'         => 'Site e-commerce sur mesure pour parfumerie de luxe.',
                'context'         => 'Sogno D\'Oro souhaitait un site e-commerce élégant et performant pour la vente de parfums de luxe.',
                'solution'        => 'Site e-commerce Laravel + React avec catalogue de produits, panier, paiement en ligne et gestion des stocks.',
                'tech_stack'      => ['Laravel', 'React', 'Stripe', 'MySQL'],
                'features'        => ['Catalogue de parfums', 'Panier d\'achat', 'Paiement en ligne', 'Gestion des stocks'],
                'tags'            => ['ecommerce', 'parfumerie', 'laravel', 'react'],
                'category'        => 'ecommerce',
                'completion_date' => '2025-11-01',
                'is_published'    => true,
                'is_featured'     => false,
                'sort_order'      => 5,
            ]
        );

        // Dina Kenitra
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projDina->id],
            [
                'title'           => 'Dina Kenitra Futsal Club',
                'client_name'     => 'Dina Kenitra',
                'excerpt'         => 'Premier site de club de futsal en Afrique avec structure de communication professionnelle.',
                'context'         => 'Dina Kenitra est un club de futsal célèbre au Maroc qui avait besoin d\'une présence en ligne professionnelle avec des fonctionnalités SaaS.',
                'solution'        => 'Plateforme SaaS pour club de futsal avec gestion d\'équipe, calendrier des matchs et communication sur les réseaux sociaux.',
                'tech_stack'      => ['Laravel', 'MySQL', 'Tailwind CSS'],
                'features'        => ['Gestion d\'équipe', 'Calendrier des matchs', 'Communication', 'Structure SaaS'],
                'tags'            => ['sport', 'futsal', 'saas', 'maroc'],
                'category'        => 'platform_saas',
                'completion_date' => '2024-08-01',
                'is_published'    => true,
                'is_featured'     => false,
                'sort_order'      => 6,
            ]
        );

        // Cabs -- featured
        PortfolioProject::updateOrCreate(
            ['projet_id' => $projCabs->id],
            [
                'title'           => 'Cabs',
                'client_name'     => 'NA Innovations (interne)',
                'excerpt'         => 'SaaS de gestion de flotte de taxis -- produit interne.',
                'context'         => 'Cabs est un produit interne de NA Innovations pour la gestion complète de flottes de taxis.',
                'solution'        => 'Application mobile + web pour la gestion de flotte, dispatching, suivi en temps réel et facturation.',
                'tech_stack'      => ['Laravel', 'React Native', 'PostgreSQL', 'WebSocket'],
                'features'        => ['Gestion de flotte', 'Dispatching', 'Suivi temps réel', 'Facturation automatique'],
                'tags'            => ['mobile', 'transport', 'saas', 'interne'],
                'category'        => 'mobile_app',
                'is_published'    => true,
                'is_featured'     => true,
                'sort_order'      => 2,
            ]
        );

        // =====================================================================
        // SETTINGS
        // =====================================================================

        Setting::set('quote.next_number', '11');
        Setting::set('invoice.next_number', '11');

        // Company settings
        $companySettings = [
            ['group' => 'company', 'key' => 'company.name', 'value' => 'NA Innovations', 'type' => 'string', 'description' => 'Nom de l\'entreprise'],
            ['group' => 'company', 'key' => 'company.address', 'value' => '170 Nijverheidskaai, Anderlecht', 'type' => 'string', 'description' => 'Adresse de l\'entreprise'],
            ['group' => 'company', 'key' => 'company.email', 'value' => 'info@nainnovations.be', 'type' => 'string', 'description' => 'E-mail de l\'entreprise'],
            ['group' => 'company', 'key' => 'company.country', 'value' => 'Belgique', 'type' => 'string', 'description' => 'Pays de l\'entreprise'],
        ];
        foreach ($companySettings as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // Social media links
        $socialLinks = [
            ['group' => 'social', 'key' => 'social.instagram', 'value' => 'https://www.instagram.com/na.innovations/', 'type' => 'string', 'description' => 'Instagram URL'],
            ['group' => 'social', 'key' => 'social.twitter', 'value' => 'https://twitter.com/AjariNawfel', 'type' => 'string', 'description' => 'X (Twitter) URL'],
            ['group' => 'social', 'key' => 'social.linkedin', 'value' => 'https://be.linkedin.com/in/nawfel-ajari', 'type' => 'string', 'description' => 'LinkedIn URL'],
            ['group' => 'social', 'key' => 'social.github', 'value' => 'https://github.com/n4wf3l', 'type' => 'string', 'description' => 'GitHub URL'],
            ['group' => 'social', 'key' => 'social.facebook', 'value' => '', 'type' => 'string', 'description' => 'Facebook URL'],
            ['group' => 'social', 'key' => 'social.youtube', 'value' => '', 'type' => 'string', 'description' => 'YouTube URL'],
            ['group' => 'social', 'key' => 'social.tiktok', 'value' => '', 'type' => 'string', 'description' => 'TikTok URL'],
        ];
        foreach ($socialLinks as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // Branding
        $branding = [
            ['group' => 'branding', 'key' => 'branding.logo_path', 'value' => '', 'type' => 'string', 'description' => 'Logo de l\'entreprise (chemin du fichier)'],
            ['group' => 'branding', 'key' => 'branding.company_name', 'value' => 'NA Innovations', 'type' => 'string', 'description' => 'Nom de l\'entreprise'],
            ['group' => 'branding', 'key' => 'branding.tagline', 'value' => 'Innovative solutions designed for you.', 'type' => 'string', 'description' => 'Slogan'],
        ];
        foreach ($branding as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // Commission rates by project type
        $commissionRates = [
            ['group' => 'commission', 'key' => 'commission.rate.static_site', 'value' => '20', 'type' => 'integer', 'description' => 'Site statique / Landing page'],
            ['group' => 'commission', 'key' => 'commission.rate.showcase_site', 'value' => '20', 'type' => 'integer', 'description' => 'Site vitrine'],
            ['group' => 'commission', 'key' => 'commission.rate.blog_portfolio', 'value' => '18', 'type' => 'integer', 'description' => 'Blog / Portfolio'],
            ['group' => 'commission', 'key' => 'commission.rate.ecommerce', 'value' => '12', 'type' => 'integer', 'description' => 'E-commerce'],
            ['group' => 'commission', 'key' => 'commission.rate.custom_cms', 'value' => '12', 'type' => 'integer', 'description' => 'Site sur mesure avec CMS'],
            ['group' => 'commission', 'key' => 'commission.rate.platform_saas', 'value' => '8', 'type' => 'integer', 'description' => 'Plateforme web / SaaS'],
            ['group' => 'commission', 'key' => 'commission.rate.mobile_app', 'value' => '6', 'type' => 'integer', 'description' => 'Application mobile'],
            ['group' => 'commission', 'key' => 'commission.rate.desktop_app', 'value' => '6', 'type' => 'integer', 'description' => 'Application desktop'],
            ['group' => 'commission', 'key' => 'commission.rate.api_backend', 'value' => '8', 'type' => 'integer', 'description' => 'API / Backend'],
            ['group' => 'commission', 'key' => 'commission.rate.maintenance', 'value' => '10', 'type' => 'integer', 'description' => 'Maintenance / Support mensuel'],
            ['group' => 'commission', 'key' => 'commission.rate.redesign', 'value' => '10', 'type' => 'integer', 'description' => 'Refonte / Migration'],
        ];
        foreach ($commissionRates as $s) {
            Setting::updateOrCreate(['key' => $s['key']], $s);
        }

        // =====================================================================
        // TIMELINE EVENTS
        // =====================================================================

        // TipTong timeline
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Devis accepté', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Devis DEV-2026-001 accepté par le client.', 'old_value' => 'sent', 'new_value' => 'accepted', 'created_at' => '2025-02-05']
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Acompte reçu', 'event_type' => 'payment'],
            ['user_id' => $nawfel->id, 'description' => 'Acompte de 7 500 EUR reçu par virement bancaire.', 'created_at' => '2025-02-12']
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Développement démarré', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Phase de développement commencée.', 'old_value' => 'planning', 'new_value' => 'in_progress', 'created_at' => '2025-02-15']
        );

        // Casa Bonita timeline
        $projCasa->timelineEvents()->updateOrCreate(
            ['title' => 'Site livré', 'event_type' => 'status_change'],
            ['user_id' => $shakil->id, 'description' => 'Site WordPress livré et mis en ligne.', 'created_at' => '2025-06-15']
        );
        $projCasa->timelineEvents()->updateOrCreate(
            ['title' => 'Hébergement expiré -- site hors ligne', 'event_type' => 'status_change'],
            ['user_id' => null, 'description' => 'Le restaurant a fermé. Le client n\'a pas payé le renouvellement de l\'hébergement. Le site est hors ligne depuis janvier 2026.', 'created_at' => '2026-01-01']
        );

        // Sogno D'Oro timeline
        $projSognodoro->timelineEvents()->updateOrCreate(
            ['title' => 'Projet démarré', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Début du développement du site e-commerce Sogno D\'Oro.', 'created_at' => '2025-08-01']
        );
        $projSognodoro->timelineEvents()->updateOrCreate(
            ['title' => 'Livraison et mise en ligne', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Site livré et mis en production. Paiement en ligne fonctionnel.', 'created_at' => '2025-11-01']
        );

        // Vericore timeline
        $projVericore->timelineEvents()->updateOrCreate(
            ['title' => 'Projet démarré', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Début du développement du site vitrine Vericore.', 'created_at' => '2025-09-01']
        );
        $projVericore->timelineEvents()->updateOrCreate(
            ['title' => 'Livraison et mise en ligne', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Site livré et mis en production.', 'created_at' => '2025-10-15']
        );

        echo "Données réelles insérées avec succès.\n";
    }
}
