<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['question' => 'Combien coûte un site web ?', 'answer' => 'Le coût dépend de la complexité du projet. Un site vitrine commence à partir de 1 500€, un e-commerce à partir de 3 000€, et une plateforme sur mesure à partir de 5 000€. Contactez-nous pour un devis personnalisé.', 'category' => 'pricing', 'sort_order' => 1],
            ['question' => 'Combien de temps prend le développement ?', 'answer' => 'Un site vitrine prend généralement 2 à 4 semaines. Un e-commerce 4 à 8 semaines. Une plateforme complexe 2 à 4 mois. Nous définissons ensemble un planning réaliste dès le début du projet.', 'category' => 'general', 'sort_order' => 2],
            ['question' => 'Proposez-vous de la maintenance ?', 'answer' => 'Oui, nous proposons des contrats de maintenance mensuels qui incluent les mises à jour de sécurité, les sauvegardes, le monitoring et le support technique.', 'category' => 'general', 'sort_order' => 3],
            ['question' => 'Quelles technologies utilisez-vous ?', 'answer' => 'Nous utilisons les technologies les plus modernes : React, Laravel, TypeScript, Tailwind CSS, PostgreSQL, et plus encore. Nous choisissons la stack la plus adaptée à chaque projet.', 'category' => 'technical', 'sort_order' => 4],
            ['question' => 'Puis-je suivre l\'avancement de mon projet ?', 'answer' => 'Absolument ! Chaque client a accès à un portail dédié où il peut suivre l\'avancement de son projet en temps réel, consulter ses devis et factures, et communiquer avec notre équipe.', 'category' => 'general', 'sort_order' => 5],
            ['question' => 'Proposez-vous un programme de parrainage ?', 'answer' => 'Oui ! Si vous connaissez quelqu\'un qui a besoin de nos services, notre programme de parrainage vous permet de toucher une commission sur chaque projet. Contactez-nous pour en savoir plus.', 'category' => 'general', 'sort_order' => 6],
        ];

        foreach ($faqs as $faq) {
            Faq::firstOrCreate(['question' => $faq['question']], $faq + ['is_active' => true]);
        }
    }
}
