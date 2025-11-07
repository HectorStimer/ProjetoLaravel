<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'Consulta Médica', 'avg_service_time_minutes' => 30],
            ['name' => 'Triagem', 'avg_service_time_minutes' => 10],
            ['name' => 'Exame de Sangue', 'avg_service_time_minutes' => 15],
            ['name' => 'Raio-X', 'avg_service_time_minutes' => 20],
            ['name' => 'Atendimento de Emergência', 'avg_service_time_minutes' => 45],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
