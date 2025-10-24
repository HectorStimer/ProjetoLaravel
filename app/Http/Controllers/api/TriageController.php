<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Triage;
use App\Models\QueueEntry;
use Illuminate\Http\Request;

class TriageController extends Controller
{
    // Criar nova triagem
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'triagist_id' => 'required|exists:users,id',
            'score' => 'required|integer|min:1|max:5',
            'notes' => 'nullable|string',
        ]);

        $triage = Triage::create($validated);

        // Enfileira automaticamente (opcional)
        QueueEntry::updateOrCreate(
            ['patient_id' => $validated['patient_id']],
            [
                'service_id' => 1,
                'status' => 'waiting',
                'priority' => $validated['score'],
                'arrived_at' => now(),
            ]
        );

        return response()->json($triage, 201);
    }

    // Listar todas
    public function index()
    {
        return response()->json(Triage::all());
    }

    // Mostrar uma triagem específica
    public function show($id)
    {
        $triage = Triage::find($id);
        if (!$triage) {
            return response()->json(['message' => 'Triagem não encontrada'], 404);
        }
        return response()->json($triage);
    }

    // Atualizar triagem
    public function update(Request $request, $id)
    {
        $triage = Triage::find($id);
        if (!$triage) {
            return response()->json(['message' => 'Triagem não encontrada'], 404);
        }

        $triage->update($request->only(['score', 'notes']));
        return response()->json($triage);
    }

    // Deletar triagem
    public function destroy($id)
    {
        $triage = Triage::find($id);
        if (!$triage) {
            return response()->json(['message' => 'Triagem não encontrada'], 404);
        }

        $triage->delete();
        return response()->json(null, 204);
    }

    // Buscar por filtros (paciente, triagista ou score)
    public function search(Request $request)
    {
        $query = Triage::query();

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->input('patient_id'));
        }
        if ($request->has('triagist_id')) {
            $query->where('triagist_id', $request->input('triagist_id'));
        }
        if ($request->has('score')) {
            $query->where('score', $request->input('score'));
        }

        return response()->json($query->get());
    }
}
