<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\QueueController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TriageController;

// ROTAS DE AUTENTICAÇÃO
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// ROTAS PROTEGIDAS
Route::middleware('auth:sanctum')->group(function () {

    // DASHBOARDS POR FUNÇÃO
    Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/triagist', [DashboardController::class, 'triagistDashboard']);
    Route::get('/dashboard/doctor', [DashboardController::class, 'doctorDashboard']);

    // PACIENTES
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

    // TRIAGEM
    Route::post('/triage', [TriageController::class, 'store']);
    Route::get('/triage/{patient_id}', [TriageController::class, 'showByPatient']);

    // FILA
    Route::get('/queue', [QueueController::class, 'index']);              // listar fila atual
    Route::post('/queue/enqueue', [QueueController::class, 'enqueue']);   // adicionar paciente na fila
    Route::post('/queue/{id}/call', [QueueController::class, 'call']);    // chamar paciente
    Route::post('/queue/{id}/start', [QueueController::class, 'start']);  // iniciar atendimento
    Route::post('/queue/{id}/finish', [QueueController::class, 'finish']); // finalizar atendimento
    Route::post('/queue/{id}/cancel', [QueueController::class, 'cancel']); // cancelar paciente
    Route::get('/queue/next', [QueueController::class, 'nextPatient']);   // próximo paciente
    Route::get('/queue/screening', [QueueController::class, 'getQueueForScreening']); // fila da triagem

    // DASHBOARD DE ESTATÍSTICAS GERAIS
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/stats/status', [DashboardController::class, 'getQueueStatusStats']);
    Route::get('/dashboard/stats/services', [DashboardController::class, 'getServiceStatistics']);
    Route::get('/dashboard/stats/daily', [DashboardController::class, 'getDailyStats']);
});
