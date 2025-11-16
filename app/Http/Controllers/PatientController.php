<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    
    public function index(Request $request)
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        
    
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($patients);
        }
      
        return Inertia::render('patients/index', [
            'patients' => $patients
        ]);
    }
    
    
    public function create(): Response
    {
        return Inertia::render('patients/create');
    }
    
   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document',
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $validated['created_by'] = auth()->id();
        
        $patient = Patient::create($validated);
        
    
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($patient, 201);
        }
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente criado com sucesso!');
    }
    
   
    public function show(Request $request, Patient $patient)
    {
      
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($patient);
        }
   
        return Inertia::render('patients/show', [
            'patient' => $patient
        ]);
    }
    
    
    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient' => $patient
        ]);
    }
    
   
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document,' . $patient->id,
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $patient->update($validated);
        
  
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($patient);
        }
        

        return redirect()->route('patients.index')
            ->with('success', 'Paciente atualizado com sucesso!');
    }
    
   
    public function destroy(Request $request, Patient $patient)
    {
        $patient->delete();
        
    
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(null, 204);
        }
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente deletado com sucesso!');
    }
}


