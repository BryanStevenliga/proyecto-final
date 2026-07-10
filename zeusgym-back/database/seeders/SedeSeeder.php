<?php

namespace Database\Seeders;

use App\Models\Sede;
use Illuminate\Database\Seeder;

class SedeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sede::query()->delete();

        Sede::create([
            'nombre' => 'Zeus Gym Norte',
            'ubicacion' => 'Av. Amazonas y Naciones Unidas (C.C. El Jardín), Quito',
            'horario_semana' => 'Lunes a Viernes: 05:00 - 22:00',
            'horario_fin' => 'Sábados y Domingos: 07:00 - 18:00',
            'imagen_url' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
        ]);

        Sede::create([
            'nombre' => 'Zeus Gym Centro',
            'ubicacion' => 'Centro Histórico, Av. Guayaquil y Chile, Quito',
            'horario_semana' => 'Lunes a Viernes: 05:00 - 22:00',
            'horario_fin' => 'Sábados y Domingos: 07:00 - 18:00',
            'imagen_url' => 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80',
        ]);

        Sede::create([
            'nombre' => 'Zeus Gym Sur',
            'ubicacion' => 'Av. Maldonado y Rodrigo de Chávez, Quito',
            'horario_semana' => 'Lunes a Viernes: 05:00 - 22:00',
            'horario_fin' => 'Sábados y Domingos: 07:00 - 18:00',
            'imagen_url' => 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1200&q=80',
        ]);
    }
}
