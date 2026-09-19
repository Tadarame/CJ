<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Usuário fixo pra você conseguir testar o login (email/senha previsíveis)
        User::firstOrCreate(
            ['email' => 'admin@cocadajak.com'],
            [
                'name' => 'Admin',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            CategorySeeder::class,
            AboutSeeder::class,
        ]);
    }
}