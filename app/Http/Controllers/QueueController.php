<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use App\Models\Service;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QueueController extends Controller
{
   
    public function index(Request $request): Response
    {
        $query = QueueEntry::with(['patient', 'service'])
            ->whereIn('status', ['waiting', 'called', 'in_service'])
            ->orderBy('priority', 'asc')
            ->orderBy('arrived_at', 'asc');

     
        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        $queueEntries = $query->get();
        $services = Service::all();
        $patients = Patient::orderBy('name')->get();

        return Inertia::render('queue/index', [
            'queueEntries' => $queueEntries,
            'services' => $services,
            'patients' => $patients,
            'selectedServiceId' => $request->service_id,
        ]);
    }

 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'service_id' => 'required|exists:services,id',
            'priority' => 'nullable|integer|min:1|max:5'
        ]);

        QueueEntry::create([
            'patient_id' => $validated['patient_id'],
            'service_id' => $validated['service_id'],
            'status' => 'waiting',
            'priority' => $validated['priority'] ?? 5,
            'arrived_at' => now(),
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('queue.index')
            ->with('success', 'Paciente adicionado à fila com sucesso!');
    }

    
    public function call($id)
    {
        $queueEntry = QueueEntry::findOrFail($id);

        if ($queueEntry->status !== 'waiting') {
            return redirect()->route('queue.index')
                ->with('error', 'Paciente não está na fila de espera');
        }

        $queueEntry->status = 'called';
        $queueEntry->called_at = now();
        $queueEntry->save();

        return redirect()->route('queue.index')
            ->with('success', 'Paciente chamado com sucesso!');
    }

    
    public function callNext(Request $request)
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
            return redirect()->route('queue.index')
                ->with('error', 'Nenhum paciente na fila');
        }

        $nextEntry->status = 'called';
        $nextEntry->called_at = now();
        $nextEntry->save();

        return redirect()->route('queue.index')
            ->with('success', 'Próximo paciente chamado com sucesso!');
    }

    
    public function start($id)
    {
        $queueEntry = QueueEntry::findOrFail($id);

        if ($queueEntry->status !== 'called') {
            return redirect()->route('queue.index')
                ->with('error', 'Paciente precisa ser chamado primeiro');
        }

        $queueEntry->status = 'in_service';
        $queueEntry->started_at = now();
        $queueEntry->save();

        return redirect()->route('queue.index')
            ->with('success', 'Atendimento iniciado com sucesso!');
    }

    
    public function finish($id)
    {
        $queueEntry = QueueEntry::findOrFail($id);

        if ($queueEntry->status !== 'in_service') {
            return redirect()->route('queue.index')
                ->with('error', 'Paciente não está em atendimento');
        }

        $queueEntry->status = 'finished';
        $queueEntry->finished_at = now();
        $queueEntry->save();

        return redirect()->route('queue.index')
            ->with('success', 'Atendimento finalizado com sucesso!');
    }

    /**
     * Cancelar paciente da fila
     */
    public function cancel($id)
    {
        $queueEntry = QueueEntry::findOrFail($id);

        $queueEntry->status = 'canceled';
        $queueEntry->save();

        return redirect()->route('queue.index')
            ->with('success', 'Paciente removido da fila com sucesso!');
    }
}

