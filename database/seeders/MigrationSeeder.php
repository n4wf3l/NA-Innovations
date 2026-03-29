<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class MigrationSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $clientRole = Role::firstOrCreate(['name' => 'client']);
        $partnerRole = Role::firstOrCreate(['name' => 'partner']);
        $developerRole = Role::firstOrCreate(['name' => 'developer']);

        // Set existing user as admin
        $admin = User::where('email', 'info@nawfelajari.be')->first();
        if ($admin) {
            $admin->update(['role' => 'admin']);
        }

        // Mark existing projets as portfolio items
        \App\Models\Projet::query()->update(['is_portfolio' => true]);

        // Seed default settings
        $settings = [
            ['group' => 'company', 'key' => 'company.name', 'value' => 'NA Innovations', 'type' => 'string'],
            ['group' => 'company', 'key' => 'company.email', 'value' => 'info@nawfelajari.be', 'type' => 'string'],
            ['group' => 'company', 'key' => 'company.phone', 'value' => '', 'type' => 'string'],
            ['group' => 'company', 'key' => 'company.address', 'value' => '170 Nijverheidskaai, Anderlecht', 'type' => 'string'],
            ['group' => 'company', 'key' => 'company.vat', 'value' => '', 'type' => 'string'],
            ['group' => 'company', 'key' => 'company.country', 'value' => 'Belgium', 'type' => 'string'],
            ['group' => 'quote', 'key' => 'quote.prefix', 'value' => 'DEV', 'type' => 'string'],
            ['group' => 'quote', 'key' => 'quote.next_number', 'value' => '1', 'type' => 'integer'],
            ['group' => 'quote', 'key' => 'quote.default_validity_days', 'value' => '30', 'type' => 'integer'],
            ['group' => 'quote', 'key' => 'quote.default_deposit_percentage', 'value' => '30', 'type' => 'integer'],
            ['group' => 'invoice', 'key' => 'invoice.prefix', 'value' => 'FAC', 'type' => 'string'],
            ['group' => 'invoice', 'key' => 'invoice.next_number', 'value' => '1', 'type' => 'integer'],
            ['group' => 'invoice', 'key' => 'invoice.payment_terms_days', 'value' => '30', 'type' => 'integer'],
            ['group' => 'invoice', 'key' => 'invoice.default_tax_rate', 'value' => '21.00', 'type' => 'string'],
            ['group' => 'invoice', 'key' => 'invoice.bank_name', 'value' => '', 'type' => 'string'],
            ['group' => 'invoice', 'key' => 'invoice.bank_iban', 'value' => '', 'type' => 'string'],
            ['group' => 'invoice', 'key' => 'invoice.bank_bic', 'value' => '', 'type' => 'string'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        // Seed default email templates
        $templates = [
            [
                'name' => 'Lead Confirmation',
                'slug' => 'lead-confirmation',
                'subject' => 'Thank you for contacting NA Innovations',
                'body' => '<p>Dear {{ client_name }},</p><p>Thank you for reaching out. We have received your inquiry and will get back to you within 24 hours.</p><p>Best regards,<br>NA Innovations</p>',
                'available_variables' => json_encode(['client_name', 'client_email', 'service_interest']),
                'category' => 'lead',
            ],
            [
                'name' => 'Quote Sent',
                'slug' => 'quote-sent',
                'subject' => 'Your quote #{{ quote_number }} from NA Innovations',
                'body' => '<p>Dear {{ client_name }},</p><p>Please find attached your quote #{{ quote_number }}.</p><p>This quote is valid until {{ valid_until }}.</p><p>Best regards,<br>NA Innovations</p>',
                'available_variables' => json_encode(['client_name', 'quote_number', 'total', 'valid_until', 'view_url']),
                'category' => 'quote',
            ],
            [
                'name' => 'Invoice Sent',
                'slug' => 'invoice-sent',
                'subject' => 'Invoice #{{ invoice_number }} from NA Innovations',
                'body' => '<p>Dear {{ client_name }},</p><p>Please find attached your invoice #{{ invoice_number }}.</p><p>Amount due: {{ total }} EUR<br>Due date: {{ due_date }}</p><p>Best regards,<br>NA Innovations</p>',
                'available_variables' => json_encode(['client_name', 'invoice_number', 'total', 'due_date', 'view_url']),
                'category' => 'invoice',
            ],
        ];

        foreach ($templates as $template) {
            \App\Models\EmailTemplate::firstOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }

        // Seed default SEO settings
        $seoSettings = [
            ['group' => 'seo', 'key' => 'seo.home_title', 'value' => 'NA Innovations — Développement Web & Mobile à Bruxelles', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.home_description', 'value' => 'Agence de développement web et mobile à Bruxelles. Sites vitrines, e-commerce, applications sur mesure. Devis gratuit.', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.projects_title', 'value' => 'Portfolio — NA Innovations', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.projects_description', 'value' => 'Découvrez nos réalisations : sites web, applications mobiles et plateformes digitales.', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.contact_title', 'value' => 'Contact — NA Innovations', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.contact_description', 'value' => 'Contactez NA Innovations pour votre projet web ou mobile. Devis gratuit sous 24h.', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.about_title', 'value' => 'À propos — NA Innovations', 'type' => 'string'],
            ['group' => 'seo', 'key' => 'seo.about_description', 'value' => 'Découvrez NA Innovations, agence de développement digital basée à Bruxelles.', 'type' => 'string'],
        ];

        foreach ($seoSettings as $s) {
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        // WhatsApp floating button
        Setting::firstOrCreate(['key' => 'social.whatsapp'], [
            'group' => 'social',
            'value' => '+32490221912',
            'type' => 'string',
            'description' => 'WhatsApp phone number for floating button',
        ]);

        // Presentation video URL
        Setting::firstOrCreate(['key' => 'branding.video_url'], [
            'group' => 'branding',
            'value' => '',
            'type' => 'string',
            'description' => 'YouTube or Vimeo embed URL for presentation video',
        ]);
    }
}
