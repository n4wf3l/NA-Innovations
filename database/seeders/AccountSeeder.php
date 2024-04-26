<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
       User::create([
            'name' => 'Nawfel Ajari',
            'email' => 'info@nawfelajari.be',
            'password' => bcrypt('security'),
        ]);
    }
}
