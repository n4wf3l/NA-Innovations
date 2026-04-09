<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PageSeeder::class,
            LandingSectionSeeder::class,
            FaqSeeder::class,
            PublicServiceSeeder::class,
            RealDataSeeder::class,
            PostSeeder::class,
            PortfolioSeeder::class,
            DevPortalDummySeeder::class,
        ]);
    }
}
