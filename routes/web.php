<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Auth routes (custom controller replacing Fortify registration/login)
Route::get('/login', [\App\Http\Controllers\Auth\AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);

Route::get('/register', [\App\Http\Controllers\Auth\AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);

// Telão público da fila (sem autenticação)
Route::get('display', [\App\Http\Controllers\QueueDisplayController::class, 'index'])->name('queue.display');
// API JSON endpoint for the public queue display (named under web routes because api.php is disabled)
Route::get('display/api', [\App\Http\Controllers\QueueDisplayController::class, 'api'])->name('queue.display.api');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Rotas de Pacientes - Apenas Triagistas e Admins podem criar/editar
    Route::get('patients', [\App\Http\Controllers\PatientController::class, 'index'])->name('patients.index');
    Route::get('patients/create', [\App\Http\Controllers\PatientController::class, 'create'])->name('patients.create');
    Route::post('patients', [\App\Http\Controllers\PatientController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('patients.store');
    Route::get('patients/{patient}', [\App\Http\Controllers\PatientController::class, 'show'])->name('patients.show');
    Route::get('patients/{patient}/edit', [\App\Http\Controllers\PatientController::class, 'edit'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('patients.edit');
    Route::put('patients/{patient}', [\App\Http\Controllers\PatientController::class, 'update'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('patients.update');
    Route::delete('patients/{patient}', [\App\Http\Controllers\PatientController::class, 'destroy'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->name('patients.destroy');
    
    // Rotas de Fila - Todos podem ver, mas apenas triagistas podem adicionar
    Route::get('queue', [\App\Http\Controllers\QueueController::class, 'index'])->name('queue.index');
    Route::post('queue', [\App\Http\Controllers\QueueController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('queue.store');
    
    // Médicos e Admins podem chamar e gerenciar atendimentos
    Route::post('queue/call-next', [\App\Http\Controllers\QueueController::class, 'callNext'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class)->name('queue.call-next');
    Route::post('queue/{id}/call', [\App\Http\Controllers\QueueController::class, 'call'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class)->name('queue.call');
    Route::post('queue/{id}/start', [\App\Http\Controllers\QueueController::class, 'start'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class)->name('queue.start');
    Route::post('queue/{id}/finish', [\App\Http\Controllers\QueueController::class, 'finish'])->middleware(\App\Http\Middleware\EnsureUserIsDoctor::class)->name('queue.finish');
    Route::post('queue/{id}/cancel', [\App\Http\Controllers\QueueController::class, 'cancel'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('queue.cancel');
    
    // Rotas de Triagem - Apenas Triagistas
    Route::get('triage', [\App\Http\Controllers\TriageController::class, 'index'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('triage.index');
    Route::get('triage/create', [\App\Http\Controllers\TriageController::class, 'create'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('triage.create');
    Route::post('triage', [\App\Http\Controllers\TriageController::class, 'store'])->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class)->name('triage.store');
    Route::get('triage/{triage}', [\App\Http\Controllers\TriageController::class, 'show'])->name('triage.show');
    Route::delete('triage/{triage}', [\App\Http\Controllers\TriageController::class, 'destroy'])->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->name('triage.destroy');
    
    Route::post('/logout', \App\Http\Controllers\Auth\LogoutController::class)
        ->middleware('auth')
        ->name('logout');
});

require __DIR__.'/settings.php';
