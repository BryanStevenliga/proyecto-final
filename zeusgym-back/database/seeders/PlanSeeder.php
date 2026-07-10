<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::query()->delete();

        Plan::create([
            'nombre' => 'Smart',
            'precio' => 24.90,
            'destacado' => false,
            'beneficios' => [
                'Acceso a 1 sede a tu elección',
                'Acceso a sala de musculación y cardio',
                'Clases grupales básicas',
                'App de seguimiento de entrenamiento',
            ],
        ]);

        Plan::create([
            'nombre' => 'Fit',
            'precio' => 34.90,
            'destacado' => false,
            'beneficios' => [
                'Acceso ilimitado a todas las sedes',
                'Acceso a sala de musculación y cardio',
                'Todas las clases grupales',
                'Zona de estiramiento y funcional',
                'App de seguimiento de entrenamiento',
            ],
        ]);

        Plan::create([
            'nombre' => 'Black',
            'precio' => 44.90,
            'destacado' => true,
            'beneficios' => [
                'Acceso ilimitado a todas las sedes',
                'Invita a un acompañante todos los meses',
                'Acceso a sala de musculación y cardio',
                'Todas las clases grupales',
                'Zona de estiramiento, funcional e hidromasaje',
                'Descuentos en productos y suplementos',
                'App de seguimiento de entrenamiento',
            ],
        ]);
    }
}
