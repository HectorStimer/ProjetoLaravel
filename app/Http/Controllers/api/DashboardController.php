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

}
