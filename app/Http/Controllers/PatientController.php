<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    /**
     * Listar todos os pacientes (Inertia)
     */
    public function index(): Response
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('patients/index', [
            'patients' => $patients
        ]);
    }
    
    /**
     * Mostrar formulário de criação
     */
    public function create(): Response
    {
        return Inertia::render('patients/create');
    }
    
    /**
     * Salvar novo paciente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document',
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $validated['created_by'] = auth()->id();
        
        Patient::create($validated);
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente criado com sucesso!');
    }
    
    /**
     * Mostrar paciente específico
     */
    public function show(Patient $patient): Response
    {
        return Inertia::render('patients/show', [
            'patient' => $patient
        ]);
    }
    
    /**
     * Mostrar formulário de edição
     */
    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient' => $patient
        ]);
    }
    
    /**
     * Atualizar paciente
     */
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document,' . $patient->id,
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $patient->update($validated);
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente atualizado com sucesso!');
    }
    
    /**
     * Deletar paciente
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente deletado com sucesso!');
    }
}

