<?php

namespace Database\Seeders;

use App\Models\Commission;
use App\Models\ProjectBudgetLine;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Lead;
use App\Models\Payment;
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
use Spatie\Permission\Models\Role;

class RealDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'developer']);
        Role::firstOrCreate(['name' => 'partner']);
        Role::firstOrCreate(['name' => 'client']);

        // ─── ADMIN / DEV: Nawfel Ajari ────────────────────────
        $nawfel = User::updateOrCreate(
            ['email' => 'info@nawfelajari.be'],
            [
                'name' => 'Nawfel Ajari',
                'password' => Hash::make('security'),
                'role' => 'admin',
                'phone' => '+32 470 000 000',
                'is_active' => true,
                'financial_pin' => Hash::make('1234'),
            ]
        );

        // ─── DEVELOPERS ───────────────────────────────────────
        $kristian = User::updateOrCreate(
            ['email' => 'kristian@na-innovations.be'],
            [
                'name' => 'Kristian Vasiaj',
                'password' => Hash::make('password'),
                'role' => 'developer',
                'is_active' => true,
                'financial_pin' => Hash::make('3456'),
            ]
        );

        $shakil = User::updateOrCreate(
            ['email' => 'shakil@na-innovations.be'],
            [
                'name' => 'Shakil Nirob',
                'password' => Hash::make('password'),
                'role' => 'developer',
                'is_active' => true,
                'financial_pin' => Hash::make('7890'),
            ]
        );

        // Manel Labied - dev without account (just a name stored in project notes)
        // We don't create a User for Manel - the system handles it

        // ─── PARTNERS ─────────────────────────────────────────
        $jonathanUser = User::updateOrCreate(
            ['email' => 'jonathan.bemba@gmail.com'],
            [
                'name' => 'Jonathan Bemba',
                'password' => Hash::make('password'),
                'role' => 'referral_partner',
                'phone' => '+32 485 111 222',
                'is_active' => true,
                'financial_pin' => Hash::make('5678'),
            ]
        );
        $jonathan = ReferralPartner::updateOrCreate(
            ['user_id' => $jonathanUser->id],
            [
                'referral_code' => 'JONATHAN',
                'default_commission_rate' => 20,
                'payment_method' => 'bank_transfer',
                'is_active' => true,
            ]
        );

        $soufianUser = User::updateOrCreate(
            ['email' => 'soufian.chourouhou@gmail.com'],
            [
                'name' => 'Soufian Chourouhou',
                'password' => Hash::make('password'),
                'role' => 'referral_partner',
                'phone' => '+32 486 333 444',
                'is_active' => true,
                'financial_pin' => Hash::make('9012'),
            ]
        );
        $soufian = ReferralPartner::updateOrCreate(
            ['user_id' => $soufianUser->id],
            [
                'referral_code' => 'SOUFIAN',
                'default_commission_rate' => 20,
                'payment_method' => 'bank_transfer',
                'is_active' => true,
            ]
        );

        // ─── CLIENTS ──────────────────────────────────────────
        $fedrik = User::updateOrCreate(
            ['email' => 'fedrik@tiptong.be'],
            [
                'name' => 'Fedrik De Beul',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'TipTong',
                'is_active' => true,
            ]
        );

        $academie = User::updateOrCreate(
            ['email' => 'contact@academiecongo.com'],
            [
                'name' => 'Académie Congo',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'Académie Congo',
                'is_active' => true,
            ]
        );

        $bxcars = User::updateOrCreate(
            ['email' => 'info@bxcars.be'],
            [
                'name' => 'BX Cars',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'BX Cars',
                'is_active' => true,
            ]
        );

        $barbershop = User::updateOrCreate(
            ['email' => 'info@tnlbarbershop.be'],
            [
                'name' => 'The Next Level Barbershop',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'The Next Level Barbershop',
                'is_active' => true,
            ]
        );

        $casabonita = User::updateOrCreate(
            ['email' => 'info@casabonitafamily.be'],
            [
                'name' => 'Casa Bonita Family',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'Casa Bonita Family',
                'is_active' => true,
            ]
        );

        $dina = User::updateOrCreate(
            ['email' => 'info@dinakenitra.ma'],
            [
                'name' => 'Dina Kenitra',
                'password' => Hash::make('password'),
                'role' => 'client',
                'company_name' => 'Dina Kenitra',
                'country' => 'Morocco',
                'is_active' => true,
            ]
        );

        // ─── LEADS ────────────────────────────────────────────

        // Académie Congo - via Jonathan Bemba
        $leadAcademie = Lead::updateOrCreate(
            ['email' => 'contact@academiecongo.com'],
            [
                'first_name' => 'Académie', 'last_name' => 'Congo',
                'company_name' => 'Académie Congo',
                'status' => 'won', 'source' => 'referral',
                'referral_partner_id' => $jonathan->id,
                'converted_client_id' => $academie->id,
                'service_interest' => 'Educational platform',
                'estimated_budget' => 6000,
                'won_at' => now()->subDays(60),
            ]
        );

        // The Next Level Barbershop - via Soufian
        $leadBarber = Lead::updateOrCreate(
            ['email' => 'info@tnlbarbershop.be'],
            [
                'first_name' => 'The Next Level', 'last_name' => 'Barbershop',
                'company_name' => 'The Next Level Barbershop',
                'status' => 'won', 'source' => 'referral',
                'referral_partner_id' => $soufian->id,
                'converted_client_id' => $barbershop->id,
                'service_interest' => 'Barbershop website',
                'estimated_budget' => 700,
                'won_at' => now()->subDays(30),
            ]
        );

        // ─── PROJECTS ─────────────────────────────────────────

        // 1. TipTong - 25.000€ - Nawfel + Kristian + Manel (no account)
        $projTiptong = Projet::updateOrCreate(
            ['nom_societe' => 'TipTong'],
            [
                'type_societe' => 'Tech / Social',
                'type_site' => 'Mobile App + Web Platform',
                'lieu' => 'Brussels',
                'client_id' => $fedrik->id,
                'developer_id' => $nawfel->id,
                'status' => 'in_progress',
                'description' => "Social tipping platform - Mobile app (iOS/Android) + Web dashboard.\nTeam: Nawfel Ajari (lead), Kristian Vasiaj (frontend), Manel Labied (backend - external).",
                'start_date' => now()->subDays(45),
                'deadline' => now()->addDays(60),
                'budget' => 25000,
                'langage_programmation' => 'React Native + Laravel',
                'nombre_collaborateurs' => 3,
            ]
        );

        // 2. Académie Congo - 6.000€ - via Jonathan (20%) - dev Nawfel
        $projAcademie = Projet::updateOrCreate(
            ['nom_societe' => 'Académie Congo'],
            [
                'type_societe' => 'Education',
                'type_site' => 'E-learning Platform',
                'lieu' => 'Brussels / Kinshasa',
                'client_id' => $academie->id,
                'developer_id' => $nawfel->id,
                'lead_id' => $leadAcademie->id,
                'status' => 'completed',
                'description' => 'Online learning platform with course management, student dashboard, and payment integration.',
                'start_date' => now()->subDays(90),
                'end_date' => now()->subDays(15),
                'budget' => 6000,
                'total_billed' => 6000,
                'jours_developpement' => 25,
                'langage_programmation' => 'Laravel + Vue.js',
                'nombre_collaborateurs' => 1,
                'etoiles' => '★★★★★',
            ]
        );

        // 3. BX Cars - 1.000€ - client direct - dev Nawfel
        $projBxcars = Projet::updateOrCreate(
            ['nom_societe' => 'BX Cars'],
            [
                'type_societe' => 'Automotive',
                'type_site' => 'Showcase Website',
                'lieu' => 'Brussels',
                'client_id' => $bxcars->id,
                'developer_id' => $nawfel->id,
                'status' => 'completed',
                'description' => 'Car dealership showcase website with inventory listing and contact form.',
                'start_date' => now()->subDays(40),
                'end_date' => now()->subDays(25),
                'budget' => 1000,
                'total_billed' => 1000,
                'jours_developpement' => 5,
                'langage_programmation' => 'Laravel + Tailwind',
                'nombre_collaborateurs' => 1,
                'etoiles' => '★★★★☆',
            ]
        );

        // 4. The Next Level Barbershop - 700€ - via Soufian (20%) - dev Nawfel
        $projBarber = Projet::updateOrCreate(
            ['nom_societe' => 'The Next Level Barbershop'],
            [
                'type_societe' => 'Beauty / Grooming',
                'type_site' => 'Booking Website',
                'lieu' => 'Brussels',
                'client_id' => $barbershop->id,
                'developer_id' => $nawfel->id,
                'lead_id' => $leadBarber->id,
                'status' => 'completed',
                'description' => 'Barbershop website with online booking system and gallery.',
                'start_date' => now()->subDays(35),
                'end_date' => now()->subDays(20),
                'budget' => 700,
                'total_billed' => 700,
                'jours_developpement' => 3,
                'langage_programmation' => 'Laravel + Tailwind',
                'nombre_collaborateurs' => 1,
                'etoiles' => '★★★★★',
            ]
        );

        // 5. Casa Bonita Family - 820€ - client direct - dev Shakil (100€) + admin Nawfel (720€)
        $projCasa = Projet::updateOrCreate(
            ['nom_societe' => 'Casa Bonita Family'],
            [
                'type_societe' => 'Restaurant / Family',
                'type_site' => 'Showcase + Menu',
                'lieu' => 'Brussels',
                'client_id' => $casabonita->id,
                'developer_id' => $shakil->id,
                'status' => 'completed',
                'description' => "Restaurant showcase with menu, gallery, and contact.\nShakil Nirob developed (paid 100€), Nawfel Ajari managed and took 720€.",
                'start_date' => now()->subDays(30),
                'end_date' => now()->subDays(18),
                'budget' => 820,
                'total_billed' => 820,
                'jours_developpement' => 4,
                'langage_programmation' => 'Laravel + Tailwind',
                'nombre_collaborateurs' => 2,
                'etoiles' => '★★★★☆',
            ]
        );

        // 6. Dina Kenitra - 250€/year subscription - client direct - dev Nawfel
        $projDina = Projet::updateOrCreate(
            ['nom_societe' => 'Dina Kenitra'],
            [
                'type_societe' => 'Business / Morocco',
                'type_site' => 'Showcase Website',
                'lieu' => 'Kenitra, Morocco',
                'client_id' => $dina->id,
                'developer_id' => $nawfel->id,
                'status' => 'completed',
                'description' => 'Business showcase website with annual subscription for hosting and maintenance.',
                'start_date' => now()->subDays(120),
                'end_date' => now()->subDays(100),
                'budget' => 250,
                'total_billed' => 250,
                'jours_developpement' => 2,
                'langage_programmation' => 'WordPress',
                'nombre_collaborateurs' => 1,
                'etoiles' => '★★★★☆',
            ]
        );

        // ─── RECURRING SERVICE for Dina ───────────────────────
        RecurringService::updateOrCreate(
            ['name' => 'Annual Subscription - Dina Kenitra'],
            [
                'client_id' => $dina->id,
                'projet_id' => $projDina->id,
                'type' => 'maintenance',
                'provider' => 'NA Innovations',
                'frequency' => 'annual',
                'purchase_date' => now()->subMonths(4),
                'expiry_date' => now()->addMonths(8),
                'real_cost' => 30,
                'billed_price' => 250,
                'margin' => 220,
                'status' => 'active',
                'auto_renew' => true,
                'description' => 'Annual hosting + maintenance + domain for Dina Kenitra website.',
            ]
        );

        // ─── COMMISSIONS ──────────────────────────────────────

        // Jonathan Bemba - 20% of Académie Congo (6000€) = 1200€
        Commission::updateOrCreate(
            ['lead_id' => $leadAcademie->id, 'referral_partner_id' => $jonathan->id],
            [
                'client_id' => $academie->id,
                'projet_id' => $projAcademie->id,
                'base_amount' => 4958.68, // 6000 / 1.21 (HT)
                'commission_rate' => 20,
                'commission_amount' => 991.74, // 20% of HT
                'status' => 'paid',
                'paid_date' => now()->subDays(10),
                'payment_reference' => 'COMM-AC-001',
            ]
        );

        // Soufian Chourouhou - 20% of Barbershop (700€) = ~115.70€
        Commission::updateOrCreate(
            ['lead_id' => $leadBarber->id, 'referral_partner_id' => $soufian->id],
            [
                'client_id' => $barbershop->id,
                'projet_id' => $projBarber->id,
                'base_amount' => 578.51, // 700 / 1.21 (HT)
                'commission_rate' => 20,
                'commission_amount' => 115.70,
                'status' => 'confirmed',
                'scheduled_payment_date' => now()->addDays(15),
            ]
        );

        // ─── CLIENT PORTAL DEMO DATA (TipTong) ──────────────

        // Quote for TipTong
        $quoteTiptong = Quote::updateOrCreate(
            ['quote_number' => 'DEV-2026-001'],
            [
                'client_id' => $fedrik->id,
                'projet_id' => $projTiptong->id,
                'client_name' => 'Fedrik De Beul',
                'client_email' => 'fedrik@tiptong.be',
                'client_company' => 'TipTong',
                'title' => 'TipTong - Mobile App + Web Platform',
                'introduction' => "Dear Fedrik,\n\nFollowing our meeting, we're pleased to present our proposal for the TipTong social tipping platform, including the mobile app (iOS & Android) and the web dashboard.",
                'scope_of_work' => "- Mobile application (React Native) for iOS and Android\n- Web dashboard for merchants and admins\n- Payment integration (Stripe)\n- Push notifications\n- User authentication and profiles\n- Analytics dashboard",
                'exclusions' => "- App Store / Google Play developer account fees\n- Third-party API costs (Stripe fees)\n- Content creation and copywriting",
                'terms_and_conditions' => "- 30% deposit required before project start\n- Final payment due upon delivery\n- 30-day revision period after delivery\n- Source code ownership transferred upon full payment",
                'subtotal' => 20661.16,
                'tax_rate' => 21,
                'tax_amount' => 4338.84,
                'total' => 25000,
                'deposit_percentage' => 30,
                'deposit_amount' => 7500,
                'status' => 'accepted',
                'accepted_at' => now()->subDays(46),
                'issue_date' => now()->subDays(50),
                'valid_until' => now()->subDays(20),
                'sent_at' => now()->subDays(48),
                'viewed_at' => now()->subDays(47),
                'view_token' => Str::random(64),
                'locale' => 'en',
            ]
        );

        // Quote items
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'UX/UI Design - Mobile App'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 3500, 'total' => 3500, 'sort_order' => 0]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'Mobile App Development (React Native)'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 12000, 'total' => 12000, 'sort_order' => 1]
        );
        QuoteItem::updateOrCreate(
            ['quote_id' => $quoteTiptong->id, 'description' => 'Web Dashboard (Laravel + React)'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 5161.16, 'total' => 5161.16, 'sort_order' => 2]
        );

        // Deposit invoice for TipTong
        $invoiceTiptongDeposit = Invoice::updateOrCreate(
            ['invoice_number' => 'FAC-2026-001'],
            [
                'quote_id' => $quoteTiptong->id,
                'client_id' => $fedrik->id,
                'projet_id' => $projTiptong->id,
                'client_name' => 'Fedrik De Beul',
                'client_email' => 'fedrik@tiptong.be',
                'client_company' => 'TipTong',
                'title' => 'Deposit Invoice - TipTong',
                'type' => 'deposit',
                'subtotal' => 6198.35,
                'tax_rate' => 21,
                'tax_amount' => 1301.65,
                'total' => 7500,
                'amount_paid' => 7500,
                'amount_due' => 0,
                'status' => 'paid',
                'issue_date' => now()->subDays(45),
                'due_date' => now()->subDays(15),
                'paid_at' => now()->subDays(43),
                'view_token' => Str::random(64),
                'locale' => 'en',
            ]
        );

        // Deposit invoice item
        InvoiceItem::updateOrCreate(
            ['invoice_id' => $invoiceTiptongDeposit->id, 'description' => 'Deposit (30%) - TipTong Mobile App + Web Platform'],
            ['quantity' => 1, 'unit' => 'forfait', 'unit_price' => 6198.35, 'total' => 6198.35, 'sort_order' => 0]
        );

        // Deposit payment
        Payment::updateOrCreate(
            ['invoice_id' => $invoiceTiptongDeposit->id, 'reference' => 'TIPTONG-DEP-001'],
            [
                'client_id' => $fedrik->id,
                'amount' => 7500,
                'currency' => 'EUR',
                'method' => 'bank_transfer',
                'payment_date' => now()->subDays(43),
                'status' => 'confirmed',
            ]
        );

        // Timeline events for TipTong project
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Quote accepted', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Quote DEV-2026-001 accepted by client', 'old_value' => 'sent', 'new_value' => 'accepted', 'created_at' => now()->subDays(46)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Project created', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Project initialized from accepted quote', 'old_value' => null, 'new_value' => 'planning', 'created_at' => now()->subDays(46)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Deposit paid', 'event_type' => 'payment'],
            ['user_id' => $nawfel->id, 'description' => 'Deposit of €7,500.00 received via bank transfer', 'created_at' => now()->subDays(43)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Project started', 'event_type' => 'status_change'],
            ['user_id' => $nawfel->id, 'description' => 'Development phase has begun', 'old_value' => 'planning', 'new_value' => 'in_progress', 'created_at' => now()->subDays(42)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'UX/UI Design completed', 'event_type' => 'update'],
            ['user_id' => $nawfel->id, 'description' => 'Mobile app wireframes and high-fidelity designs approved. Moving to development phase.', 'created_at' => now()->subDays(30)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Mobile app - authentication module', 'event_type' => 'update'],
            ['user_id' => $nawfel->id, 'description' => 'User registration, login, and profile management completed. Push notification integration in progress.', 'created_at' => now()->subDays(15)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Client comment', 'event_type' => 'comment'],
            ['user_id' => $fedrik->id, 'description' => 'Looking great so far! Can we also add a dark mode option to the app?', 'created_at' => now()->subDays(12)]
        );
        $projTiptong->timelineEvents()->updateOrCreate(
            ['title' => 'Stripe integration', 'event_type' => 'update'],
            ['user_id' => $nawfel->id, 'description' => 'Payment processing via Stripe Connect is now functional. Merchants can receive tips directly.', 'created_at' => now()->subDays(5)]
        );

        // ─── RTA POKER + BUDGET LINES ────────────────────────
        $rtaPoker = Projet::firstOrCreate(
            ['nom_societe' => 'RTA Poker'],
            [
                'type_site' => 'Application Web',
                'type_societe' => 'Gaming',
                'status' => 'in_progress',
                'budget' => 4500,
                'description' => 'Application de poker en ligne avec revenue share mensuel.',
                'start_date' => now()->subDays(30),
                'deadline' => now()->addDays(35),
                'developer_id' => $nawfel->id,
            ]
        );

        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $rtaPoker->id, 'label' => 'Revenue share mensuel'],
            ['type' => 'income', 'amount' => 3000.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => now()->addDays(35), 'is_confirmed' => false, 'notes' => "Promis par le client si l'app sort en mai 2026"]
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $rtaPoker->id, 'label' => 'Paiement developpement'],
            ['type' => 'income', 'amount' => 4500.00, 'frequency' => 'one_time', 'trigger' => 'immediate', 'is_confirmed' => true, 'notes' => 'Paiement unique pour le developpement']
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $rtaPoker->id, 'label' => 'Serveur & hebergement'],
            ['type' => 'expense', 'amount' => 49.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => now()->subDays(25), 'is_confirmed' => true]
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $rtaPoker->id, 'label' => 'Nom de domaine'],
            ['type' => 'expense', 'amount' => 15.00, 'frequency' => 'annual', 'trigger' => 'from_date', 'start_date' => now()->subDays(25), 'is_confirmed' => true]
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $rtaPoker->id, 'label' => 'API Stripe (frais)'],
            ['type' => 'expense', 'amount' => 120.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => now()->addDays(35), 'is_confirmed' => false, 'notes' => 'Estimation frais de transaction Stripe']
        );

        // ─── BUDGET LINES: Academie Congo ─────────────────────
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $projAcademie->id, 'label' => 'Maintenance mensuelle'],
            ['type' => 'income', 'amount' => 100.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-05-01', 'is_confirmed' => true, 'notes' => 'Contrat maintenance mensuel']
        );

        // ─── BUDGET LINES: EasyWed ──────────────────────────
        $projEasywed = Projet::firstOrCreate(
            ['nom_societe' => 'EasyWed'],
            ['type_site' => 'Application Web', 'type_societe' => 'Wedding', 'status' => 'completed', 'budget' => 2600, 'description' => 'Plateforme de gestion de mariage', 'start_date' => now()->subDays(60), 'end_date' => now()->subDays(10), 'developer_id' => $nawfel->id]
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $projEasywed->id, 'label' => 'Abonnement mensuel client'],
            ['type' => 'income', 'amount' => 150.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-05-01', 'is_confirmed' => true, 'notes' => 'Revenu recurrent post-livraison']
        );
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $projEasywed->id, 'label' => 'Developpement initial'],
            ['type' => 'income', 'amount' => 2600.00, 'frequency' => 'one_time', 'trigger' => 'immediate', 'is_confirmed' => true]
        );

        // ─── BUDGET LINES: TipTong ──────────────────────────
        ProjectBudgetLine::firstOrCreate(
            ['project_id' => $projTiptong->id, 'label' => 'Revenue share mensuel'],
            ['type' => 'income', 'amount' => 2000.00, 'frequency' => 'monthly', 'trigger' => 'from_date', 'start_date' => '2026-06-01', 'is_confirmed' => false, 'notes' => 'Revenue share apres lancement']
        );

        // ─── SOCIAL MEDIA LINKS ─────────────────────────────────
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
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        // Company branding
        $branding = [
            ['group' => 'branding', 'key' => 'branding.logo_path', 'value' => '', 'type' => 'string', 'description' => 'Logo de l\'entreprise (chemin du fichier)'],
            ['group' => 'branding', 'key' => 'branding.company_name', 'value' => 'NA Innovations', 'type' => 'string', 'description' => 'Nom de l\'entreprise'],
            ['group' => 'branding', 'key' => 'branding.tagline', 'value' => 'Innovative solutions designed for you.', 'type' => 'string', 'description' => 'Slogan'],
        ];
        foreach ($branding as $s) {
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        // ─── SETTINGS ─────────────────────────────────────────
        Setting::set('quote.next_number', '10');
        Setting::set('invoice.next_number', '10');

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
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        echo "Real data seeded successfully.\n";
    }
}
