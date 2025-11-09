<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QueueDisplayController extends Controller
{
    /**
     * Telão público da fila - sem autenticação
     */
    public function index(Request $request): Response
    {
        $query = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called', 'in_service'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc');

        // Filtro por serviço se fornecido
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $queueEntries = $query->get();
        $services = Service::all();

        // Separar por status
        $waiting = $queueEntries->where('status', 'waiting')->values();
        $called = $queueEntries->where('status', 'called')->values();
        $inService = $queueEntries->where('status', 'in_service')->values();

        return Inertia::render('queue/display', [
            'waiting' => $waiting,
            'called' => $called,
            'inService' => $inService,
            'services' => $services,
            'selectedServiceId' => $request->service_id,
        ]);
    }

    /**
     * API para atualização em tempo real do telão
     */
    public function api(Request $request)
    {
        $query = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called', 'in_service'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc');

        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $queueEntries = $query->get();

        return response()->json([
            'waiting' => $queueEntries->where('status', 'waiting')->values(),
            'called' => $queueEntries->where('status', 'called')->values(),
            'inService' => $queueEntries->where('status', 'in_service')->values(),
        ]);
    }
}

