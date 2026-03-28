<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Seed demo blog posts.
     */
    public function run(): void
    {
        $nawfel = User::where('email', 'info@nawfelajari.be')->first();

        $posts = [
            [
                'title' => 'Comment choisir la bonne stack technique pour votre projet web',
                'slug' => 'choisir-stack-technique-projet-web',
                'subject' => 'Guide technique',
                'excerpt' => 'React, Vue, Angular ? Laravel, Django, Node ? Découvrez comment choisir les bonnes technologies pour votre projet en fonction de vos besoins, votre budget et vos ambitions.',
                'description' => 'Guide complet pour choisir sa stack technique.',
                'content' => '<h2>Introduction</h2><p>Le choix de la stack technique est l\'une des décisions les plus importantes au début d\'un projet web. Une mauvaise décision peut coûter des mois de retard et des milliers d\'euros.</p><h2>Les critères de choix</h2><p>Plusieurs facteurs entrent en jeu :</p><ul><li><strong>La complexité du projet</strong> : un site vitrine n\'a pas les mêmes besoins qu\'une plateforme SaaS</li><li><strong>Le budget</strong> : certaines technologies nécessitent plus de temps de développement</li><li><strong>La maintenabilité</strong> : qui va maintenir le code après le lancement ?</li><li><strong>La scalabilité</strong> : le projet doit-il supporter 100 ou 100 000 utilisateurs ?</li></ul><h2>Notre recommandation</h2><p>Chez NA Innovations, nous utilisons principalement <strong>React + Laravel + TypeScript</strong>. Cette combinaison offre le meilleur équilibre entre performance, productivité et maintenabilité.</p><h3>Pour un site vitrine</h3><p>Un site statique ou un CMS comme WordPress peut suffire. Mais si vous avez des besoins spécifiques, un site sur mesure avec React sera plus performant et plus flexible.</p><h3>Pour une application web</h3><p>React pour le frontend, Laravel pour le backend, PostgreSQL pour la base de données. C\'est notre stack de prédilection pour les projets complexes.</p><h2>Conclusion</h2><p>Il n\'y a pas de stack universelle. Le bon choix dépend de votre contexte. N\'hésitez pas à nous contacter pour un conseil personnalisé.</p>',
                'category' => 'Technique',
                'tags' => ['React', 'Laravel', 'TypeScript', 'Stack technique'],
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'author_id' => $nawfel?->id,
            ],
            [
                'title' => '5 erreurs à éviter quand on lance son site e-commerce',
                'slug' => '5-erreurs-lancement-site-ecommerce',
                'subject' => 'E-commerce',
                'excerpt' => 'Lancer un e-commerce est excitant, mais de nombreux entrepreneurs commettent des erreurs coûteuses. Voici les 5 pièges les plus fréquents et comment les éviter.',
                'description' => 'Les erreurs classiques du e-commerce.',
                'content' => '<h2>Erreur #1 : Négliger le mobile</h2><p>Plus de 70% des achats en ligne se font sur mobile. Si votre site n\'est pas parfaitement responsive, vous perdez des clients chaque jour.</p><h2>Erreur #2 : Ignorer le SEO dès le départ</h2><p>Le référencement naturel prend du temps. Si vous attendez le lancement pour y penser, vous partez avec 6 mois de retard sur vos concurrents.</p><h2>Erreur #3 : Trop de fonctionnalités au lancement</h2><p>Lancez avec le minimum viable. Ajoutez des fonctionnalités en fonction des retours clients, pas de vos suppositions.</p><h2>Erreur #4 : Sous-estimer la logistique</h2><p>Le meilleur site du monde ne sert à rien si vos livraisons sont chaotiques. Préparez votre logistique avant le lancement.</p><h2>Erreur #5 : Pas de stratégie d\'acquisition</h2><p>Un site sans trafic est un site mort. Prévoyez un budget marketing dès le départ : SEO, publicité, réseaux sociaux.</p>',
                'category' => 'Business',
                'tags' => ['E-commerce', 'Conseils', 'Lancement'],
                'status' => 'published',
                'published_at' => now()->subDays(12),
                'author_id' => $nawfel?->id,
            ],
            [
                'title' => 'Pourquoi chaque entreprise a besoin d\'un portail client en 2026',
                'slug' => 'portail-client-entreprise-2026',
                'subject' => 'Transformation digitale',
                'excerpt' => 'Un portail client n\'est plus un luxe — c\'est une nécessité. Découvrez pourquoi et comment un portail client peut transformer votre relation avec vos clients.',
                'description' => 'L\'importance du portail client.',
                'content' => '<h2>Le problème</h2><p>Vos clients vous envoient des emails pour savoir où en est leur projet. Ils appellent pour demander une facture. Ils ne retrouvent pas leur devis. Ça vous prend du temps, et ça frustre le client.</p><h2>La solution : le portail client</h2><p>Un espace dédié où le client peut :</p><ul><li>Suivre l\'avancement de son projet en temps réel</li><li>Consulter et accepter ses devis</li><li>Voir et télécharger ses factures</li><li>Communiquer avec votre équipe</li><li>Signer des documents en ligne</li></ul><h2>Les bénéfices</h2><p><strong>Pour vous</strong> : moins d\'emails, moins d\'appels, plus de temps pour développer. <strong>Pour le client</strong> : transparence totale, autonomie, professionnalisme.</p><h2>Comment on fait chez NA Innovations</h2><p>Chaque client NA Innovations a accès à un portail dédié dès que son projet démarre. C\'est inclus dans nos prestations, pas en supplément.</p>',
                'category' => 'Business',
                'tags' => ['Portail client', 'Digitalisation', 'Relation client'],
                'status' => 'published',
                'published_at' => now()->subDays(20),
                'author_id' => $nawfel?->id,
            ],
        ];

        foreach ($posts as $data) {
            $post = Post::firstOrCreate(['slug' => $data['slug']], $data);
            $post->reading_time = $post->calculateReadingTime();
            $post->save();
        }
    }
}
