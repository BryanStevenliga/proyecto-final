<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $table = 'planes';

    protected $fillable = [
        'nombre',
        'precio',
        'destacado',
        'beneficios',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'destacado' => 'boolean',
        'beneficios' => 'array',
    ];
}
