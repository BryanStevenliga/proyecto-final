<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Plan;
use App\Models\Sede;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Member::query()->delete();

        $sedes = Sede::query()->pluck('id', 'nombre');
        $planes = Plan::query()->pluck('id', 'nombre');

        $members = [
            [
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'celular' => '0991234567',
                'email' => 'juan.perez@zeusgym.com',
                'sede_id' => $sedes['Zeus Gym Norte'],
                'plan_id' => $planes['Black'],
            ],
            [
                'nombre' => 'María',
                'apellido' => 'Espinoza',
                'celular' => '0987654321',
                'email' => 'maria.espinoza@zeusgym.com',
                'sede_id' => $sedes['Zeus Gym Centro'],
                'plan_id' => $planes['Smart'],
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'Mendoza',
                'celular' => '0976543210',
                'email' => 'carlos.mendoza@zeusgym.com',
                'sede_id' => $sedes['Zeus Gym Sur'],
                'plan_id' => $planes['Fit'],
            ],
            [
                'nombre' => 'Andrea',
                'apellido' => 'Guamán',
                'celular' => '0965432109',
                'email' => 'andrea.guaman@zeusgym.com',
                'sede_id' => $sedes['Zeus Gym Norte'],
                'plan_id' => $planes['Smart'],
            ],
            [
                'nombre' => 'Luis',
                'apellido' => 'Chicaiza',
                'celular' => '0954321098',
                'email' => 'luis.chicaiza@zeusgym.com',
                'sede_id' => $sedes['Zeus Gym Centro'],
                'plan_id' => $planes['Black'],
            ],
        ];

        foreach ($members as $member) {
            Member::create($member);
        }
    }
}
