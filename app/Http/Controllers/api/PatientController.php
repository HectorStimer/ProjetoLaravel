<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    #listar
    public function index()
    {
        return response()->json(Patient::all());
    }

    #criar
    public function store(Request $request){
        $validated = $request->validate([
            'name'=> 'required|string|max:50',
            'birth_date'=>'required|date',
            'document'=>'nullable|string|max:20|unique:patients,document',
            'phone'=>'nullable|string|max:15' 
        ]);
        
        // Mapear birth_date corretamente
        $patientData = [
            'name' => $validated['name'],
            'birth_date' => $validated['birth_date'],
            'document' => $validated['document'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'created_by' => auth()->id(),
        ];
        
        $patient = Patient::create($patientData);
        return response()->json($patient,201);
    }
        
    


    #mostrar especifico
    public function show($id){
        $patient = Patient::find($id);
        if(!$patient){
            return response()->json(['message'=>'Paciente não encontrado'],404);
        }
        return response()->json($patient);
    }
    #atualizar
    public function update(Request $request, $id){
        $patient = Patient::find($id);
        if (!$patient){
            return response()->json(['message'=>'Paciente não encontrado'],404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'birth_date' => 'sometimes|required|date|before:today|after:1900-01-01',
            'document' => 'sometimes|nullable|string|max:20|unique:patients,document,' . $id,
            'phone' => 'sometimes|nullable|string|max:15'
        ]);

        $patient->update($validated);
        return response()->json($patient);
    }
    #destruir legal 
    public function destroy($id){
        $patient = Patient::find($id);
        if (!$patient){
            return response()->json(['message'=>'Paciente não encontrado'],404);
        }
        $patient->delete();
        return response()->json(null,204);
    }
}
