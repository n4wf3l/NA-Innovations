<?php

namespace Database\Seeders;

use App\Models\DevMessage;
use App\Models\ProjectMilestone;
use App\Models\Projet;
use App\Models\Setting;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class DevPortalDummySeeder extends Seeder
{
    public function run(): void
    {
        // Default settings
        $keys = [
            'dev.show_earnings',
            'dev.show_hourly_rate',
            'dev.require_time_approval',
            'dev.allow_release',
            'dev.show_skills_matching',
            'dev.show_team_contacts',
            'dev.show_milestones',
            'dev.show_credentials',
            'dev.show_messaging',
            'dev.allow_blocked_status',
            'dev.show_useful_links',
            'dev.decloisoned_notes',
        ];
        foreach ($keys as $k) {
            Setting::set($k, '1');
        }
        $this->command?->info('Dev portal settings: all enabled.');

        $dev = User::where('role', 'developer')->first();
        if (!$dev) {
            $this->command?->warn('No developer user found — skipping dummy data.');
            return;
        }

        $dev->update([
            'hourly_rate' => 65,
            'skills' => ['Laravel', 'React', 'TypeScript', 'Tailwind', 'PostgreSQL'],
            'specialties' => ['SaaS', 'Dashboards', 'E-commerce'],
            'bio' => 'Développeur full-stack spécialisé dans les applications web modernes.',
        ]);

        $projects = Projet::where('developer_id', $dev->id)->limit(2)->get();
        $admin = User::where('role', 'admin')->first();

        foreach ($projects as $project) {
            $project->update([
                'estimated_hours' => 80,
                'project_credentials' => "Admin: admin@example.com\nMot de passe: ChangeMe!2026\nFTP: ftp.example.com",
                'project_env' => "APP_ENV=production\nDB_HOST=127.0.0.1\nDB_DATABASE=" . strtolower(str_replace(' ', '_', $project->nom_societe)) . "\nMAIL_DRIVER=smtp",
            ]);

            // Milestones
            $milestones = [
                ['label' => 'Phase de découverte', 'status' => 'done', 'due_date' => now()->subDays(20)],
                ['label' => 'Développement MVP', 'status' => 'in_progress', 'due_date' => now()->addDays(15)],
                ['label' => 'Mise en production', 'status' => 'pending', 'due_date' => now()->addDays(45)],
            ];
            foreach ($milestones as $i => $m) {
                ProjectMilestone::updateOrCreate(
                    ['project_id' => $project->id, 'label' => $m['label']],
                    array_merge($m, ['sort_order' => $i, 'description' => 'Étape clé du projet.'])
                );
            }

            // Messages
            DevMessage::create([
                'project_id' => $project->id,
                'sender_id' => $dev->id,
                'recipient_role' => 'admin',
                'content' => 'Bonjour, j\'ai démarré le projet. Pouvez-vous me confirmer le périmètre exact ?',
            ]);
            if ($admin) {
                DevMessage::create([
                    'project_id' => $project->id,
                    'sender_id' => $admin->id,
                    'recipient_role' => 'dev',
                    'content' => 'Bonjour, oui le périmètre est confirmé. Bon développement !',
                ]);
            }
        }

        // Mark half time entries pending
        $entries = TimeEntry::where('user_id', $dev->id)->get();
        $half = max(1, (int) floor($entries->count() / 2));
        foreach ($entries->take($half) as $entry) {
            $entry->update(['approval_status' => 'pending', 'approved_at' => null]);
        }

        $this->command?->info("Dev portal dummy data seeded for {$dev->name}.");
    }
}
