<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\DashboardController as ApiDashboardController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Api\TriageController;
use App\Http\Controllers\ServiceController;

// ROTAS DE AUTENTICAÇÃO
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// TELÃO PÚBLICO DA FILA (sem autenticação)
Route::get('/display', [\App\Http\Controllers\QueueDisplayController::class, 'api']);

// Aceita autenticação via token (Sanctum) ou sessão (web)
Route::middleware(\App\Http\Middleware\ApiAuth::class)->group(function () {

    // DASHBOARDS POR FUNÇÃO (API)
    Route::get('/dashboard/admin', [ApiDashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/triagist', [ApiDashboardController::class, 'triagistDashboard']);
    Route::get('/dashboard/doctor', [ApiDashboardController::class, 'doctorDashboard']);

    // ROTAS DE PACIENTES - Todos podem ver, mas apenas triagistas podem criar/editar
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class);

    // TRIAGEM - Apenas Triagistas
    Route::post('/triage', [TriageController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class);
    Route::get('/triage/{patient_id}', [TriageController::class, 'showByPatient']);

    // SERVIÇOS - Apenas Admins podem criar/editar
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class);
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    Route::put('/services/{id}', [ServiceController::class, 'update'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class);

    // FILA - Todos podem ver, mas ações específicas por função
    Route::get('/queue', [QueueController::class, 'index']);              // listar fila atual - todos
    Route::post('/queue/enqueue', [QueueController::class, 'enqueue'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class);   // adicionar paciente na fila - triagista
    Route::post('/queue/{id}/call', [QueueController::class, 'call'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class);    // chamar paciente - médico
    Route::post('/queue/{id}/start', [QueueController::class, 'start'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class);  // iniciar atendimento - médico
    Route::post('/queue/{id}/finish', [QueueController::class, 'finish'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class); // finalizar atendimento - médico
    Route::post('/queue/{id}/cancel', [QueueController::class, 'cancel'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class); // cancelar paciente - triagista
    Route::get('/queue/next', [QueueController::class, 'nextPatient'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class);   // próximo paciente - médico
    Route::get('/queue/screening', [QueueController::class, 'getQueueForScreening'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class); // fila da triagem - triagista

    // DASHBOARD DE ESTATÍSTICAS GERAIS
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/stats/status', [DashboardController::class, 'getQueueStatusStats']);
    Route::get('/dashboard/stats/services', [DashboardController::class, 'getServiceStatistics']);
    Route::get('/dashboard/stats/daily', [DashboardController::class, 'getDailyStats']);
});
