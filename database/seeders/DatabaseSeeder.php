<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Services
        $this->call(ServiceSeeder::class);

        // Criar usuário admin padrão
        User::firstOrCreate(
            ['email' => 'admin@hospital.com'],
            [
                'name' => 'Administrador',
                'password' => bcrypt('admin123'),
                'function' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Criar usuário triagista padrão
        User::firstOrCreate(
            ['email' => 'triagista@hospital.com'],
            [
                'name' => 'Triagista',
                'password' => bcrypt('triagista123'),
                'function' => 'triagist',
                'email_verified_at' => now(),
            ]
        );

        // Criar usuário médico padrão
        User::firstOrCreate(
            ['email' => 'medico@hospital.com'],
            [
                'name' => 'Médico',
                'password' => bcrypt('medico123'),
                'function' => 'doctor',
                'email_verified_at' => now(),
            ]
        );
    }
}
