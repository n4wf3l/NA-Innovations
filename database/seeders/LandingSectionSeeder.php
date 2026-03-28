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
    }
}
