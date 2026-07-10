<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sede;
use Illuminate\Http\JsonResponse;

class SedeController extends Controller
{
    public function index(): JsonResponse
    {
        $sedes = Sede::all();

        return response()->json($sedes);
    }
}
