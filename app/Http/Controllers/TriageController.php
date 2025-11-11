<?php

namespace App\Http\Controllers;

use App\Models\Triage;
use App\Models\Patient;
use App\Models\QueueEntry;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TriageController extends Controller
{
    
    public function index(Request $request): Response
    {
        $query = Triage::with(['patient', 'triagist'])
            ->orderBy('created_at', 'desc');

       
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('score')) {
            $query->where('score', $request->score);
        }

        $triages = $query->get();
        $patients = Patient::orderBy('name')->get();

        return Inertia::render('triage/index', [
            'triages' => $triages,
            'patients' => $patients,
        ]);
    }

    public function create(): Response
    {
        $patients = Patient::orderBy('name')->get();
        $services = Service::all();

        return Inertia::render('triage/create', [
            'patients' => $patients,
            'services' => $services,
        ]);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'score' => 'required|integer|min:1|max:5',
            'notes' => 'nullable|string',
            'service_id' => 'nullable|exists:services,id',
            'add_to_queue' => 'nullable|boolean',
        ]);

        $triage = Triage::create([
            'patient_id' => $validated['patient_id'],
            'triagist_id' => auth()->id(),
            'score' => $validated['score'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Adicionar à fila automaticamente se solicitado
        if ($request->boolean('add_to_queue')) {
            $serviceId = $validated['service_id'] ?? Service::first()?->id ?? 1;
            
            QueueEntry::updateOrCreate(
                [
                    'patient_id' => $validated['patient_id'],
                    'status' => 'waiting',
                ],
                [
                    'service_id' => $serviceId,
                    'priority' => $validated['score'], // Prioridade = score da triagem
                    'arrived_at' => now(),
                    'created_by' => auth()->id(),
                ]
            );
        }

        return redirect()->route('triage.index')
            ->with('success', 'Triagem criada com sucesso!');
    }

    
    public function show(Triage $triage): Response
    {
        $triage->load(['patient', 'triagist']);

        return Inertia::render('triage/show', [
            'triage' => $triage,
        ]);
    }

    
    public function destroy(Triage $triage)
    {
        $triage->delete();

        return redirect()->route('triage.index')
            ->with('success', 'Triagem deletada com sucesso!');
    }
}

