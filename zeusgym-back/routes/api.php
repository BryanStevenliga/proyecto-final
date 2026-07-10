<?php

use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\SedeController;
use Illuminate\Support\Facades\Route;

Route::get('/sedes', [SedeController::class, 'index']);
Route::get('/planes', [PlanController::class, 'index']);
Route::apiResource('members', MemberController::class);
