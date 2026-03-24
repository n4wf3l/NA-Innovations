<?php

namespace Database\Seeders;

use App\Models\Commission;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Payment;
use App\Models\Post;
use App\Models\Projet;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\RecurringService;
use App\Models\ReferralPartner;
use App\Models\Setting;
use App\Models\TimelineEvent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // ─── DEVELOPERS ────────────────────────────────────────
        $dev1 = User::create([
            'name' => 'Amine Bouali',
            'email' => 'amine@na-innovations.be',
            'password' => bcrypt('password'),
            'role' => 'developer',
            'phone' => '+32 470 111 222',
            'is_active' => true,
        ]);

        $dev2 = User::create([
            'name' => 'Sara Dupont',
            'email' => 'sara@na-innovations.be',
            'password' => bcrypt('password'),
            'role' => 'developer',
            'phone' => '+32 470 333 444',
            'is_active' => true,
        ]);

        $admin = User::where('email', 'info@nawfelajari.be')->first();

        // ─── REFERRAL PARTNERS ─────────────────────────────────
        $partner1User = User::create([
            'name' => 'Karim El Amrani',
            'email' => 'karim@gmail.com',
            'password' => bcrypt('password'),
            'role' => 'referral_partner',
            'phone' => '+32 486 555 666',
            'is_active' => true,
        ]);
        $partner1 = ReferralPartner::create([
            'user_id' => $partner1User->id,
            'referral_code' => 'KARIM2026',
            'default_commission_rate' => 10,
            'payment_method' => 'bank_transfer',
            'bank_iban' => 'BE68 5390 0754 7034',
            'is_active' => true,
        ]);

        $partner2User = User::create([
            'name' => 'Lisa Van den Berg',
            'email' => 'lisa.vdb@outlook.com',
            'password' => bcrypt('password'),
            'role' => 'referral_partner',
            'phone' => '+32 479 777 888',
            'is_active' => true,
        ]);
        $partner2 = ReferralPartner::create([
            'user_id' => $partner2User->id,
            'referral_code' => 'LISAVDB',
            'default_commission_rate' => 12,
            'payment_method' => 'paypal',
            'paypal_email' => 'lisa.vdb@outlook.com',
            'is_active' => true,
        ]);

        // ─── CLIENTS ──────────────────────────────────────────
        $client1 = User::create([
            'name' => 'Thomas Janssen',
            'email' => 'thomas@brouwershof.be',
            'password' => bcrypt('password'),
            'role' => 'client',
            'phone' => '+32 2 511 22 33',
            'company_name' => 'Brouwershof BVBA',
            'vat_number' => 'BE0123.456.789',
            'address' => 'Rue du Marché 45',
            'city' => 'Brussels',
            'postal_code' => '1000',
            'country' => 'Belgium',
        ]);

        $client2 = User::create([
            'name' => 'Marie Lefevre',
            'email' => 'marie@luxecoiffure.be',
            'password' => bcrypt('password'),
            'role' => 'client',
            'phone' => '+32 2 644 55 66',
            'company_name' => 'Luxe Coiffure',
            'vat_number' => 'BE0987.654.321',
            'address' => 'Avenue Louise 120',
            'city' => 'Brussels',
            'postal_code' => '1050',
        ]);

        $client3 = User::create([
            'name' => 'Pieter De Wolf',
            'email' => 'pieter@fitsquad.be',
            'password' => bcrypt('password'),
            'role' => 'client',
            'phone' => '+32 3 222 33 44',
            'company_name' => 'FitSquad Gym',
            'address' => 'Turnhoutsebaan 78',
            'city' => 'Antwerp',
            'postal_code' => '2140',
        ]);

        $client4 = User::create([
            'name' => 'Sophie Martin',
            'email' => 'sophie@greenplate.be',
            'password' => bcrypt('password'),
            'role' => 'client',
            'company_name' => 'Green Plate Restaurant',
            'city' => 'Ghent',
        ]);

        // ─── LEADS ────────────────────────────────────────────
        $lead1 = Lead::create([
            'first_name' => 'Thomas', 'last_name' => 'Janssen',
            'email' => 'thomas@brouwershof.be', 'phone' => '+32 2 511 22 33',
            'company_name' => 'Brouwershof BVBA',
            'status' => 'won', 'source' => 'referral',
            'referral_partner_id' => $partner1->id,
            'converted_client_id' => $client1->id,
            'service_interest' => 'E-commerce website',
            'estimated_budget' => 8500,
            'won_at' => now()->subDays(45),
        ]);

        $lead2 = Lead::create([
            'first_name' => 'Marie', 'last_name' => 'Lefevre',
            'email' => 'marie@luxecoiffure.be',
            'company_name' => 'Luxe Coiffure',
            'status' => 'won', 'source' => 'website_contact',
            'converted_client_id' => $client2->id,
            'service_interest' => 'Booking website',
            'estimated_budget' => 4500,
            'won_at' => now()->subDays(30),
        ]);

        $lead3 = Lead::create([
            'first_name' => 'Pieter', 'last_name' => 'De Wolf',
            'email' => 'pieter@fitsquad.be',
            'company_name' => 'FitSquad Gym',
            'status' => 'quote_sent', 'source' => 'referral',
            'referral_partner_id' => $partner2->id,
            'service_interest' => 'Mobile app',
            'estimated_budget' => 12000,
        ]);

        $lead4 = Lead::create([
            'first_name' => 'Sophie', 'last_name' => 'Martin',
            'email' => 'sophie@greenplate.be',
            'company_name' => 'Green Plate Restaurant',
            'status' => 'qualified', 'source' => 'social_media',
            'service_interest' => 'Restaurant website with reservation',
            'estimated_budget' => 3500,
        ]);

        $lead5 = Lead::create([
            'first_name' => 'Jan', 'last_name' => 'Peters',
            'email' => 'jan.peters@outlook.be',
            'status' => 'contacted', 'source' => 'organic',
            'service_interest' => 'Portfolio website',
            'estimated_budget' => 2000,
        ]);

        $lead6 = Lead::create([
            'first_name' => 'Elena', 'last_name' => 'Rossi',
            'email' => 'elena@rossi-import.it',
            'company_name' => 'Rossi Import & Export',
            'status' => 'new', 'source' => 'referral',
            'referral_partner_id' => $partner1->id,
            'service_interest' => 'Custom CRM software',
            'estimated_budget' => 25000,
        ]);

        $lead7 = Lead::create([
            'first_name' => 'Omar', 'last_name' => 'Benali',
            'email' => 'omar@technofix.be',
            'company_name' => 'TechnoFix',
            'status' => 'lost', 'source' => 'advertising',
            'service_interest' => 'Website redesign',
            'estimated_budget' => 3000,
            'lost_reason' => 'Budget too low',
            'lost_at' => now()->subDays(10),
        ]);

        // Timeline events for leads
        foreach ([$lead1, $lead2, $lead3, $lead4, $lead5, $lead6, $lead7] as $lead) {
            $lead->timelineEvents()->create([
                'user_id' => $admin?->id,
                'event_type' => 'status_change',
                'title' => 'Lead created',
                'description' => "Lead {$lead->first_name} {$lead->last_name} was created.",
            ]);
        }

        // ─── PROJECTS ─────────────────────────────────────────
        $project1 = Projet::create([
            'nom_societe' => 'Brouwershof E-commerce',
            'type_societe' => 'Food & Beverage',
            'type_site' => 'E-commerce',
            'lieu' => 'Brussels',
            'client_id' => $client1->id,
            'developer_id' => $dev1->id,
            'lead_id' => $lead1->id,
            'status' => 'completed',
            'description' => 'Full e-commerce platform for artisanal Belgian brewery. Online shop with subscription system.',
            'start_date' => now()->subDays(60),
            'end_date' => now()->subDays(5),
            'budget' => 8500,
            'total_billed' => 8500,
            'jours_developpement' => 35,
            'langage_programmation' => 'Laravel + Vue.js',
            'nombre_collaborateurs' => 2,
            'etoiles' => '★★★★★',
        ]);

        $project2 = Projet::create([
            'nom_societe' => 'Luxe Coiffure Booking',
            'type_societe' => 'Beauty & Wellness',
            'type_site' => 'Booking Website',
            'lieu' => 'Brussels',
            'client_id' => $client2->id,
            'developer_id' => $admin?->id,
            'lead_id' => $lead2->id,
            'status' => 'in_progress',
            'description' => 'Online booking platform with calendar integration, SMS reminders, and payment.',
            'start_date' => now()->subDays(15),
            'deadline' => now()->addDays(30),
            'budget' => 4500,
        ]);

        $project3 = Projet::create([
            'nom_societe' => 'FitSquad Mobile App',
            'type_societe' => 'Sport & Fitness',
            'type_site' => 'Mobile App',
            'lieu' => 'Antwerp',
            'client_id' => $client3->id,
            'developer_id' => $dev2->id,
            'status' => 'planning',
            'description' => 'Cross-platform fitness tracking app with workout plans and social features.',
            'budget' => 12000,
            'deadline' => now()->addDays(90),
        ]);

        $project4 = Projet::create([
            'nom_societe' => 'Green Plate Website',
            'type_societe' => 'Restaurant',
            'type_site' => 'Showcase + Reservation',
            'lieu' => 'Ghent',
            'client_id' => $client4->id,
            'status' => 'review',
            'description' => 'Restaurant showcase with online table reservation, menu gallery, and contact form.',
            'start_date' => now()->subDays(25),
            'deadline' => now()->addDays(5),
            'budget' => 3500,
            'developer_id' => $dev1->id,
        ]);

        $project5 = Projet::create([
            'nom_societe' => 'Internal CRM Tool',
            'type_societe' => 'Internal',
            'type_site' => 'SaaS',
            'client_id' => null,
            'developer_id' => $admin?->id,
            'status' => 'on_hold',
            'description' => 'Internal CRM system development (paused for client priority).',
            'budget' => 0,
        ]);

        // Timeline events for projects
        foreach ([$project1, $project2, $project3, $project4, $project5] as $p) {
            $p->timelineEvents()->create([
                'user_id' => $admin?->id,
                'event_type' => 'project_created',
                'title' => 'Project created',
                'description' => "Project \"{$p->nom_societe}\" was created.",
            ]);
        }

        // ─── QUOTES ───────────────────────────────────────────
        $quote1 = Quote::create([
            'quote_number' => 'DEV-2026-001',
            'lead_id' => $lead1->id,
            'client_id' => $client1->id,
            'projet_id' => $project1->id,
            'client_name' => 'Thomas Janssen',
            'client_email' => 'thomas@brouwershof.be',
            'client_company' => 'Brouwershof BVBA',
            'client_vat' => 'BE0123.456.789',
            'title' => 'E-commerce Platform - Brouwershof',
            'introduction' => 'Following our meeting, here is our proposal for your e-commerce platform.',
            'subtotal' => 7024.79,
            'tax_rate' => 21,
            'tax_amount' => 1475.21,
            'total' => 8500,
            'deposit_percentage' => 30,
            'deposit_amount' => 2550,
            'status' => 'accepted',
            'issue_date' => now()->subDays(50),
            'valid_until' => now()->subDays(20),
            'accepted_at' => now()->subDays(48),
            'view_token' => Str::random(64),
        ]);
        QuoteItem::create(['quote_id' => $quote1->id, 'section' => 'Design', 'description' => 'UI/UX Design & Wireframes', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 1500, 'total' => 1500, 'sort_order' => 0]);
        QuoteItem::create(['quote_id' => $quote1->id, 'section' => 'Development', 'description' => 'E-commerce platform development (Laravel + Vue.js)', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 4000, 'total' => 4000, 'sort_order' => 1]);
        QuoteItem::create(['quote_id' => $quote1->id, 'section' => 'Development', 'description' => 'Payment integration (Mollie)', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 800, 'total' => 800, 'sort_order' => 2]);
        QuoteItem::create(['quote_id' => $quote1->id, 'section' => 'Other', 'description' => 'Subscription module', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 724.79, 'total' => 724.79, 'sort_order' => 3]);

        $quote2 = Quote::create([
            'quote_number' => 'DEV-2026-002',
            'lead_id' => $lead3->id,
            'client_id' => $client3->id,
            'client_name' => 'Pieter De Wolf',
            'client_email' => 'pieter@fitsquad.be',
            'client_company' => 'FitSquad Gym',
            'title' => 'FitSquad Mobile Application',
            'subtotal' => 9917.36,
            'tax_rate' => 21,
            'tax_amount' => 2082.64,
            'total' => 12000,
            'deposit_percentage' => 30,
            'deposit_amount' => 3600,
            'status' => 'sent',
            'issue_date' => now()->subDays(5),
            'valid_until' => now()->addDays(25),
            'sent_at' => now()->subDays(5),
            'view_token' => Str::random(64),
        ]);
        QuoteItem::create(['quote_id' => $quote2->id, 'description' => 'Mobile App Design (iOS + Android)', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 2500, 'total' => 2500, 'sort_order' => 0]);
        QuoteItem::create(['quote_id' => $quote2->id, 'description' => 'Cross-platform development (React Native)', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 6000, 'total' => 6000, 'sort_order' => 1]);
        QuoteItem::create(['quote_id' => $quote2->id, 'description' => 'Backend API development', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 1417.36, 'total' => 1417.36, 'sort_order' => 2]);

        $quote3 = Quote::create([
            'quote_number' => 'DEV-2026-003',
            'client_name' => 'Sophie Martin',
            'client_email' => 'sophie@greenplate.be',
            'client_company' => 'Green Plate Restaurant',
            'title' => 'Restaurant Website',
            'subtotal' => 2892.56,
            'tax_rate' => 21,
            'tax_amount' => 607.44,
            'total' => 3500,
            'status' => 'draft',
            'issue_date' => now(),
            'valid_until' => now()->addDays(30),
            'view_token' => Str::random(64),
        ]);

        // Update next quote number in settings
        Setting::set('quote.next_number', '4');

        // ─── INVOICES ─────────────────────────────────────────
        $invoice1 = Invoice::create([
            'invoice_number' => 'FAC-2026-001',
            'quote_id' => $quote1->id,
            'client_id' => $client1->id,
            'projet_id' => $project1->id,
            'client_name' => 'Thomas Janssen',
            'client_email' => 'thomas@brouwershof.be',
            'client_company' => 'Brouwershof BVBA',
            'client_vat' => 'BE0123.456.789',
            'title' => 'Deposit - Brouwershof E-commerce',
            'type' => 'deposit',
            'subtotal' => 2107.44,
            'tax_rate' => 21,
            'tax_amount' => 442.56,
            'total' => 2550,
            'amount_paid' => 2550,
            'amount_due' => 0,
            'status' => 'paid',
            'issue_date' => now()->subDays(48),
            'due_date' => now()->subDays(18),
            'paid_at' => now()->subDays(46),
            'view_token' => Str::random(64),
        ]);
        InvoiceItem::create(['invoice_id' => $invoice1->id, 'description' => 'Deposit (30%) - E-commerce Platform', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 2107.44, 'total' => 2107.44]);

        $invoice2 = Invoice::create([
            'invoice_number' => 'FAC-2026-002',
            'quote_id' => $quote1->id,
            'client_id' => $client1->id,
            'projet_id' => $project1->id,
            'client_name' => 'Thomas Janssen',
            'client_email' => 'thomas@brouwershof.be',
            'client_company' => 'Brouwershof BVBA',
            'title' => 'Final Invoice - Brouwershof E-commerce',
            'type' => 'final',
            'subtotal' => 4917.36,
            'tax_rate' => 21,
            'tax_amount' => 1032.64,
            'total' => 5950,
            'amount_paid' => 5950,
            'amount_due' => 0,
            'status' => 'paid',
            'issue_date' => now()->subDays(5),
            'due_date' => now()->addDays(25),
            'paid_at' => now()->subDays(2),
            'view_token' => Str::random(64),
        ]);
        InvoiceItem::create(['invoice_id' => $invoice2->id, 'description' => 'E-commerce development (remaining 70%)', 'quantity' => 1, 'unit' => 'forfait', 'unit_price' => 4917.36, 'total' => 4917.36]);

        $invoice3 = Invoice::create([
            'invoice_number' => 'FAC-2026-003',
            'client_id' => $client2->id,
            'projet_id' => $project2->id,
            'client_name' => 'Marie Lefevre',
            'client_email' => 'marie@luxecoiffure.be',
            'client_company' => 'Luxe Coiffure',
            'title' => 'Deposit - Luxe Coiffure Booking',
            'type' => 'deposit',
            'subtotal' => 1115.70,
            'tax_rate' => 21,
            'tax_amount' => 234.30,
            'total' => 1350,
            'amount_paid' => 1350,
            'amount_due' => 0,
            'status' => 'paid',
            'issue_date' => now()->subDays(15),
            'due_date' => now()->addDays(15),
            'paid_at' => now()->subDays(13),
            'view_token' => Str::random(64),
        ]);

        $invoice4 = Invoice::create([
            'invoice_number' => 'FAC-2026-004',
            'client_id' => $client4->id,
            'projet_id' => $project4->id,
            'client_name' => 'Sophie Martin',
            'client_email' => 'sophie@greenplate.be',
            'client_company' => 'Green Plate Restaurant',
            'title' => 'Deposit - Green Plate Website',
            'type' => 'deposit',
            'subtotal' => 867.77,
            'tax_rate' => 21,
            'tax_amount' => 182.23,
            'total' => 1050,
            'amount_paid' => 0,
            'amount_due' => 1050,
            'status' => 'overdue',
            'issue_date' => now()->subDays(20),
            'due_date' => now()->subDays(5),
            'view_token' => Str::random(64),
        ]);

        Setting::set('invoice.next_number', '5');

        // ─── PAYMENTS ─────────────────────────────────────────
        Payment::create(['invoice_id' => $invoice1->id, 'client_id' => $client1->id, 'amount' => 2550, 'method' => 'bank_transfer', 'reference' => '+++120/4567/89012+++', 'payment_date' => now()->subDays(46), 'status' => 'confirmed']);
        Payment::create(['invoice_id' => $invoice2->id, 'client_id' => $client1->id, 'amount' => 5950, 'method' => 'bank_transfer', 'reference' => '+++120/4567/89013+++', 'payment_date' => now()->subDays(2), 'status' => 'confirmed']);
        Payment::create(['invoice_id' => $invoice3->id, 'client_id' => $client2->id, 'amount' => 1350, 'method' => 'bank_transfer', 'payment_date' => now()->subDays(13), 'status' => 'confirmed']);

        // ─── COMMISSIONS ──────────────────────────────────────
        Commission::create([
            'referral_partner_id' => $partner1->id,
            'lead_id' => $lead1->id,
            'client_id' => $client1->id,
            'projet_id' => $project1->id,
            'invoice_id' => $invoice1->id,
            'base_amount' => 2107.44,
            'commission_rate' => 10,
            'commission_amount' => 210.74,
            'status' => 'paid',
            'paid_date' => now()->subDays(40),
            'payment_reference' => 'COMM-001',
        ]);

        Commission::create([
            'referral_partner_id' => $partner1->id,
            'lead_id' => $lead1->id,
            'client_id' => $client1->id,
            'projet_id' => $project1->id,
            'invoice_id' => $invoice2->id,
            'base_amount' => 4917.36,
            'commission_rate' => 10,
            'commission_amount' => 491.74,
            'status' => 'confirmed',
        ]);

        // ─── RECURRING SERVICES ───────────────────────────────
        RecurringService::create([
            'client_id' => $client1->id, 'projet_id' => $project1->id,
            'type' => 'hosting', 'name' => 'OVH Cloud Hosting - brouwershof.be',
            'provider' => 'OVH', 'frequency' => 'annual',
            'purchase_date' => now()->subDays(55), 'expiry_date' => now()->addDays(310),
            'real_cost' => 89, 'billed_price' => 180, 'margin' => 91,
            'status' => 'active', 'auto_renew' => true,
        ]);

        RecurringService::create([
            'client_id' => $client1->id,
            'type' => 'domain', 'name' => 'brouwershof.be',
            'provider' => 'OVH', 'frequency' => 'annual',
            'purchase_date' => now()->subDays(55), 'expiry_date' => now()->addDays(310),
            'real_cost' => 12, 'billed_price' => 25, 'margin' => 13,
            'status' => 'active',
        ]);

        RecurringService::create([
            'client_id' => $client2->id, 'projet_id' => $project2->id,
            'type' => 'hosting', 'name' => 'Vercel Pro - luxecoiffure.be',
            'provider' => 'Vercel', 'frequency' => 'monthly',
            'purchase_date' => now()->subDays(15), 'expiry_date' => now()->addDays(15),
            'real_cost' => 20, 'billed_price' => 45, 'margin' => 25,
            'status' => 'active',
        ]);

        RecurringService::create([
            'client_id' => $client4->id,
            'type' => 'ssl', 'name' => 'SSL Certificate - greenplate.be',
            'provider' => 'Cloudflare', 'frequency' => 'annual',
            'purchase_date' => now()->subMonths(11), 'expiry_date' => now()->addDays(18),
            'real_cost' => 0, 'billed_price' => 50, 'margin' => 50,
            'status' => 'expiring_soon',
        ]);

        RecurringService::create([
            'client_id' => $client3->id,
            'type' => 'email', 'name' => 'Google Workspace - fitsquad.be',
            'provider' => 'Google', 'frequency' => 'monthly',
            'purchase_date' => now()->subMonths(3), 'expiry_date' => now()->addDays(8),
            'real_cost' => 6, 'billed_price' => 15, 'margin' => 9,
            'status' => 'active', 'auto_renew' => true,
        ]);

        // ─── POSTS ────────────────────────────────────────────
        Post::create([
            'title' => 'Launching Brouwershof E-commerce Platform',
            'subject' => 'Case Study',
            'description' => 'We are proud to announce the launch of the Brouwershof e-commerce platform. This project features a full online shop with subscription-based beer delivery, integrated payment via Mollie, and a modern responsive design built with Laravel and Vue.js.',
        ]);

        Post::create([
            'title' => 'NA Innovations expands development team',
            'subject' => 'Company News',
            'description' => 'We are excited to welcome two talented developers to the NA Innovations team. With a growing number of projects, our expanded team allows us to deliver even more ambitious digital solutions while maintaining our quality standards.',
        ]);

        Post::create([
            'title' => 'Why every business needs a mobile-first website in 2026',
            'subject' => 'Insights',
            'description' => 'With over 70% of web traffic now coming from mobile devices, having a mobile-first approach is no longer optional. In this article, we explore the key principles of mobile-first design and how it impacts user engagement, SEO rankings, and conversion rates.',
        ]);

        // ─── MESSAGES (ticker) ────────────────────────────────
        Message::create(['content' => 'New project launched: Brouwershof E-commerce', 'enabled' => true]);
        Message::create(['content' => 'NA Innovations - Web, Mobile & Software Development', 'enabled' => true]);
    }
}
