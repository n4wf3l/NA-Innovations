<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

/**
 * Restore the entire database from a JSON snapshot.
 *
 * Usage:
 *   php artisan db:seed --class=SnapshotSeeder
 *
 * This will:
 *   1. Read database/seeders/snapshot.json
 *   2. Insert all records into their respective tables (using updateOrCreate by id)
 *   3. Copy all seed assets from database/seeders/assets/ to storage/app/public/
 */
class SnapshotSeeder extends Seeder
{
    /**
     * Tables in correct insertion order (respecting foreign keys).
     */
    private array $tableOrder = [
        'users',
        'referral_partners',
        'projets',
        'leads',
        'quotes',
        'quote_items',
        'invoices',
        'invoice_items',
        'payments',
        'commissions',
        'recurring_services',
        'project_budget_lines',
        'project_payouts',
        'timeline_events',
        'portfolio_projects',
        'portfolio_images',
        'products',
        'posts',
        'settings',
        'landing_sections',
        'faqs',
        'public_services',
        'pages',
        'document_templates',
        'project_documents',
    ];

    public function run(): void
    {
        $snapshotPath = database_path('seeders/snapshot.json');

        if (!File::exists($snapshotPath)) {
            $this->command->error('snapshot.json not found in database/seeders/');
            return;
        }

        $data = json_decode(File::get($snapshotPath), true);

        if (!$data) {
            $this->command->error('Failed to parse snapshot.json');
            return;
        }

        // Disable foreign key checks during seeding
        Schema::disableForeignKeyConstraints();

        foreach ($this->tableOrder as $table) {
            if (!isset($data[$table]) || empty($data[$table])) {
                continue;
            }

            if (!Schema::hasTable($table)) {
                $this->command->warn("Table {$table} does not exist, skipping.");
                continue;
            }

            $rows = $data[$table];
            $count = 0;

            foreach ($rows as $row) {
                // Remove auto-managed timestamps that might cause issues
                unset($row['remember_token']);

                if (isset($row['id'])) {
                    DB::table($table)->updateOrInsert(
                        ['id' => $row['id']],
                        $row
                    );
                } else {
                    DB::table($table)->insert($row);
                }
                $count++;
            }

            $this->command->info("  {$table}: {$count} records");
        }

        // Handle email_templates separately (large table)
        if (isset($data['email_templates']) && !empty($data['email_templates'])) {
            $count = 0;
            foreach ($data['email_templates'] as $row) {
                DB::table('email_templates')->updateOrInsert(
                    ['id' => $row['id']],
                    $row
                );
                $count++;
            }
            $this->command->info("  email_templates: {$count} records");
        }

        Schema::enableForeignKeyConstraints();

        // Copy assets to storage
        $assetsPath = database_path('seeders/assets');
        $storagePath = storage_path('app/public');

        if (File::isDirectory($assetsPath)) {
            $this->copyDirectory($assetsPath, $storagePath);
            $this->command->info('  Assets copied to storage/app/public/');
        }

        $this->command->info('');
        $this->command->info('Snapshot restored successfully!');
    }

    private function copyDirectory(string $source, string $destination): void
    {
        if (!File::isDirectory($destination)) {
            File::makeDirectory($destination, 0755, true);
        }

        foreach (File::allFiles($source) as $file) {
            $relativePath = $file->getRelativePath();
            $targetDir = $destination . ($relativePath ? '/' . $relativePath : '');

            if (!File::isDirectory($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
            }

            File::copy(
                $file->getPathname(),
                $targetDir . '/' . $file->getFilename()
            );
        }
    }
}
