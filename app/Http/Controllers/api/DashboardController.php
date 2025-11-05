<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Triage;
use App\Models\Patient;
use App\Models\QueueEntry;

class DashboardController extends Controller
{
    public function getDashboardData(){
        $totalPatients = Patient::count();
        $totalTriageEntries = Triage::count();
        $totalQueueEntries = QueueEntry::count();

        return response()->json([
            'total_patients' => $totalPatients,
            'total_triage_entries' => $totalTriageEntries,
            'total_queue_entries' => $totalQueueEntries
        ]);

    }
    public function summary()
{
    $data = [
        'total_patients' => Patient::count(),
        'active_queue' => QueueEntry::whereIn('status', ['waiting', 'called', 'in_service'])->count(),
        'patients_served_today' => QueueEntry::whereDate('finished_at', now()->toDateString())->count(),
        'average_wait_time' => QueueEntry::whereNotNull('called_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, arrived_at, called_at)) as avg')
            ->value('avg'),
        'average_service_time' => QueueEntry::whereNotNull('finished_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, started_at, finished_at)) as avg')
            ->value('avg'),
    ];

    return response()->json($data);
}


    public function getRecentPatients(){
        $recentPatients = Patient::orderBy('created_at','desc')->take(5)->get();
        return response()->json($recentPatients);
    }

    public function getMedicalQueue(){
        $queueEntries = QueueEntry::with('patient','service')->orderBy('created_at','asc')->get();
        return response()->json($queueEntries);
    }

    public function getTriageStatistics(){
        $totalTriageEntries = Triage::count();
        $averageWaitingTime = Triage::avg('waiting_time_minutes');

        return response()->json([
            'total_triage_entries' => $totalTriageEntries,
            'average_waiting_time_minutes' => $averageWaitingTime
        ]);
    }

    public function getServiceStatistics(){
        $serviceStats = Triage::select('service_id')
            ->selectRaw('COUNT(*) as total_entries')
            ->selectRaw('AVG(waiting_time_minutes) as avg_waiting_time')
            ->groupBy('service_id')
            ->with('service')
            ->get();

        return response()->json($serviceStats);
    }
    
    public function getMedialTimeStatistics(){
        $averageServiceTime = Triage::avg('service_time_minutes');

        return response()->json([
            'average_service_time_minutes' => $averageServiceTime
        ]);
    }

    /**
     * Dashboard do administrador
     */
    public function adminDashboard()
    {
        $summaryResponse = $this->summary();
        $queueStatusResponse = $this->getQueueStatusStats();
        $serviceStatsResponse = $this->getServiceStatistics();
        
        $data = [
            'summary' => json_decode($summaryResponse->getContent(), true),
            'recent_patients' => Patient::orderBy('created_at', 'desc')->take(10)->get(),
            'queue_status' => json_decode($queueStatusResponse->getContent(), true),
            'service_statistics' => json_decode($serviceStatsResponse->getContent(), true),
        ];

        return response()->json($data);
    }

    /**
     * Dashboard do triagista
     */
    public function triagistDashboard()
    {
        $triageStatsResponse = $this->getTriageStatistics();
        
        $data = [
            'queue_for_screening' => QueueEntry::with(['patient', 'service'])
                ->whereIn('status', ['waiting', 'called'])
                ->orderBy('priority', 'asc')
                ->orderBy('arrived_at', 'asc')
                ->get(),
            'recent_triages' => Triage::with(['patient', 'trigist'])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
            'triage_statistics' => json_decode($triageStatsResponse->getContent(), true),
        ];

        return response()->json($data);
    }

    /**
     * Dashboard do médico
     */
    public function doctorDashboard()
    {
        $data = [
            'current_queue' => QueueEntry::with(['patient', 'service'])
                ->whereIn('status', ['called', 'in_service'])
                ->orderBy('priority', 'asc')
                ->orderBy('arrived_at', 'asc')
                ->get(),
            'recent_patients' => Patient::orderBy('created_at', 'desc')->take(10)->get(),
            'summary' => [
                'waiting' => QueueEntry::where('status', 'waiting')->count(),
                'called' => QueueEntry::where('status', 'called')->count(),
                'in_service' => QueueEntry::where('status', 'in_service')->count(),
            ],
        ];

        return response()->json($data);
    }

    /**
     * Estatísticas de status da fila
     */
    public function getQueueStatusStats()
    {
        $stats = QueueEntry::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return response()->json([
            'waiting' => $stats['waiting'] ?? 0,
            'called' => $stats['called'] ?? 0,
            'in_service' => $stats['in_service'] ?? 0,
            'finished' => $stats['finished'] ?? 0,
            'canceled' => $stats['canceled'] ?? 0,
        ]);
    }

    /**
     * Estatísticas diárias
     */
    public function getDailyStats()
    {
        $today = now()->toDateString();
        
        $data = [
            'date' => $today,
            'patients_registered' => Patient::whereDate('created_at', $today)->count(),
            'triages_performed' => Triage::whereDate('created_at', $today)->count(),
            'patients_served' => QueueEntry::whereDate('finished_at', $today)->count(),
            'patients_in_queue' => QueueEntry::whereIn('status', ['waiting', 'called', 'in_service'])->count(),
            'average_wait_time' => QueueEntry::whereNotNull('called_at')
                ->whereDate('called_at', $today)
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, arrived_at, called_at)) as avg')
                ->value('avg'),
            'average_service_time' => QueueEntry::whereNotNull('finished_at')
                ->whereDate('finished_at', $today)
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, started_at, finished_at)) as avg')
                ->value('avg'),
        ];

        return response()->json($data);
    }

}
