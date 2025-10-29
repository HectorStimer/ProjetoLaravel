<?php

namespace App\Http\Controllers;

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
            'date_of_birth'=>'required|date',
            'document'=>'string|max:20|unique:patients,document',
            'phone'=>'nullable|string|max:15' 
        ]);
        $patient = Patient::create($validated);
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
        $patient->update($request->all());
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
