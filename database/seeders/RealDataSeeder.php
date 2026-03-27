<?php

namespace Database\Seeders;

use App\Models\Commission;
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

        // ─── SETTINGS ─────────────────────────────────────────
        Setting::set('quote.next_number', '10');
        Setting::set('invoice.next_number', '10');

        echo "Real data seeded successfully.\n";
    }
}
