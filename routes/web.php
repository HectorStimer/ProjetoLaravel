<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Rotas de Pacientes
    Route::resource('patients', \App\Http\Controllers\PatientController::class);
    
    // Rotas de Fila
    Route::get('queue', [\App\Http\Controllers\QueueController::class, 'index'])->name('queue.index');
    Route::post('queue', [\App\Http\Controllers\QueueController::class, 'store'])->name('queue.store');
    Route::post('queue/call-next', [\App\Http\Controllers\QueueController::class, 'callNext'])->name('queue.call-next');
    Route::post('queue/{id}/call', [\App\Http\Controllers\QueueController::class, 'call'])->name('queue.call');
    Route::post('queue/{id}/start', [\App\Http\Controllers\QueueController::class, 'start'])->name('queue.start');
    Route::post('queue/{id}/finish', [\App\Http\Controllers\QueueController::class, 'finish'])->name('queue.finish');
    Route::post('queue/{id}/cancel', [\App\Http\Controllers\QueueController::class, 'cancel'])->name('queue.cancel');
    
    // Rotas de Triagem
    Route::get('triage', [\App\Http\Controllers\TriageController::class, 'index'])->name('triage.index');
    Route::get('triage/create', [\App\Http\Controllers\TriageController::class, 'create'])->name('triage.create');
    Route::post('triage', [\App\Http\Controllers\TriageController::class, 'store'])->name('triage.store');
    Route::get('triage/{triage}', [\App\Http\Controllers\TriageController::class, 'show'])->name('triage.show');
    Route::delete('triage/{triage}', [\App\Http\Controllers\TriageController::class, 'destroy'])->name('triage.destroy');
});

require __DIR__.'/settings.php';
