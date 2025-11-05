<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QueueEntry;

class QueueController extends Controller
{
    /**
     * Listar fila atual
     */
    public function index(Request $request)
    {
        $query = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called', 'in_service'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc');

        // Filtro por serviço se fornecido
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        return response()->json($query->get());
    }

    /**
     * Adicionar paciente à fila
     */
    public function enqueue(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'service_id' => 'required|exists:services,id',
            'priority' => 'nullable|integer|min:1|max:5'
        ]);

        $queueEntry = QueueEntry::create([
            'patient_id' => $validated['patient_id'],
            'service_id' => $validated['service_id'],
            'status' => 'waiting',
            'priority' => $validated['priority'] ?? 5,
            'arrived_at' => now(),
        ]);

        return response()->json($queueEntry, 201);
    }

    /**
     * Cancelar (remover) paciente da fila
     */
    public function cancel($id)
    {
        $queueEntry = QueueEntry::find($id);

        if (!$queueEntry) {
            return response()->json(['message' => 'Entrada na fila não encontrada'], 404);
        }

        $queueEntry->status = 'canceled';
        $queueEntry->save();

        return response()->json($queueEntry);
    }

    /**
     * Chamar paciente específico
     */
    public function call($id)
    {
        $queueEntry = QueueEntry::find($id);

        if (!$queueEntry) {
            return response()->json(['message' => 'Entrada na fila não encontrada'], 404);
        }

        if ($queueEntry->status !== 'waiting') {
            return response()->json(['message' => 'Paciente não está na fila de espera'], 400);
        }

        $queueEntry->status = 'called';
        $queueEntry->called_at = now();
        $queueEntry->save();

        return response()->json($queueEntry->load(['patient', 'service']));
    }

    /**
     * Chamar o próximo paciente da fila (por serviço)
     */
    public function callNext($serviceId)
    {
        $nextEntry = QueueEntry::where('service_id', $serviceId)
            ->where('status', 'waiting')
            ->orderBy('priority', 'asc') // menor prioridade = mais urgente
            ->orderBy('arrived_at', 'asc')
            ->first();

        if (!$nextEntry) {
            return response()->json(['message' => 'Nenhum paciente na fila'], 404);
        }

        $nextEntry->status = 'called';
        $nextEntry->called_at = now();
        $nextEntry->save();

        return response()->json($nextEntry);
    }

    /**
     * Iniciar atendimento
     */
    public function start($id)
    {
        $queueEntry = QueueEntry::where('id', $id)
            ->where('status', 'called')
            ->first();

        if (!$queueEntry) {
            return response()->json(['message' => 'Nenhum paciente chamado'], 404);
        }

        $queueEntry->status = 'in_service';
        $queueEntry->started_at = now();
        $queueEntry->save();

        return response()->json($queueEntry->load(['patient', 'service']));
    }

    /**
     * Iniciar atendimento (método alternativo)
     */
    public function startService($id)
    {
        return $this->start($id);
    }

    /**
     * Finalizar atendimento
     */
    public function finish($id)
    {
        $queueEntry = QueueEntry::where('id', $id)
            ->where('status', 'in_service')
            ->first();

        if (!$queueEntry) {
            return response()->json(['message' => 'Nenhum paciente em atendimento'], 404);
        }

        $queueEntry->status = 'finished';
        $queueEntry->finished_at = now();
        $queueEntry->save();

        return response()->json($queueEntry->load(['patient', 'service']));
    }

    /**
     * Próximo paciente da fila
     */
    public function nextPatient(Request $request)
    {
        $serviceId = $request->input('service_id');
        
        $query = QueueEntry::where('status', 'waiting')
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc');

        if ($serviceId) {
            $query->where('service_id', $serviceId);
        }

        $nextEntry = $query->first();

        if (!$nextEntry) {
            return response()->json(['message' => 'Nenhum paciente na fila'], 404);
        }

        return response()->json($nextEntry->load(['patient', 'service']));
    }

    /**
     * Fila para triagem
     */
    public function getQueueForScreening()
    {
        $queueEntries = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc')
            ->get();

        return response()->json($queueEntries);
    }
}
