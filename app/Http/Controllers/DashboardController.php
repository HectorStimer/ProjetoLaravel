<?php

namespace App\Http\Controllers;

use App\Models\Triage;
use App\Models\Patient;
use App\Models\QueueEntry;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Dashboard principal - redireciona baseado na função do usuário
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $function = $user->function ?? 'admin';

        // Redireciona para o dashboard específico da função
        return match($function) {
            'admin' => $this->admin($request),
            'triagist' => $this->triagist($request),
            'doctor' => $this->doctor($request),
            default => $this->admin($request),
        };
    }

    /**
     * Dashboard do administrador
     */
    public function admin(Request $request): Response
    {
        $summary = [
            'total_patients' => Patient::count(),
            'active_queue' => QueueEntry::whereIn('status', ['waiting', 'called', 'in_service'])->count(),
            'patients_served_today' => QueueEntry::whereDate('finished_at', now()->toDateString())->count(),
            'average_wait_time' => QueueEntry::whereNotNull('called_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, arrived_at, called_at)) as avg')
                ->value('avg') ?? 0,
            'average_service_time' => QueueEntry::whereNotNull('finished_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, started_at, finished_at)) as avg')
                ->value('avg') ?? 0,
        ];

        $queueStatus = [
            'waiting' => QueueEntry::where('status', 'waiting')->count(),
            'called' => QueueEntry::where('status', 'called')->count(),
            'in_service' => QueueEntry::where('status', 'in_service')->count(),
            'finished' => QueueEntry::where('status', 'finished')->count(),
            'canceled' => QueueEntry::where('status', 'canceled')->count(),
        ];

        $recentPatients = Patient::orderBy('created_at', 'desc')->take(10)->get();
        
        $services = Service::all();
        $serviceStats = [];
        foreach ($services as $service) {
            $serviceStats[] = [
                'service' => $service,
                'total_entries' => QueueEntry::where('service_id', $service->id)->count(),
                'active_entries' => QueueEntry::where('service_id', $service->id)
                    ->whereIn('status', ['waiting', 'called', 'in_service'])
                    ->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'type' => 'admin',
            'summary' => $summary,
            'queueStatus' => $queueStatus,
            'recentPatients' => $recentPatients,
            'serviceStats' => $serviceStats,
        ]);
    }

    /**
     * Dashboard do triagista
     */
    public function triagist(Request $request): Response
    {
        $queueForScreening = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc')
            ->get();

        $recentTriages = Triage::with(['patient', 'trigist'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $triageStatistics = [
            'total_triages' => Triage::count(),
            'triages_today' => Triage::whereDate('created_at', now()->toDateString())->count(),
            'average_score' => Triage::avg('score') ?? 0,
        ];

        return Inertia::render('dashboard', [
            'type' => 'triagist',
            'queueForScreening' => $queueForScreening,
            'recentTriages' => $recentTriages,
            'triageStatistics' => $triageStatistics,
        ]);
    }

    /**
     * Dashboard do médico
     */
    public function doctor(Request $request): Response
    {
        $currentQueue = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['called', 'in_service'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc')
            ->get();

        $recentPatients = Patient::orderBy('created_at', 'desc')->take(10)->get();

        $summary = [
            'waiting' => QueueEntry::where('status', 'waiting')->count(),
            'called' => QueueEntry::where('status', 'called')->count(),
            'in_service' => QueueEntry::where('status', 'in_service')->count(),
        ];

        return Inertia::render('dashboard', [
            'type' => 'doctor',
            'currentQueue' => $currentQueue,
            'recentPatients' => $recentPatients,
            'summary' => $summary,
        ]);
    }
}

