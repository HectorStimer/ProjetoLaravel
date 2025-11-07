<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    /**
     * Listar todos os serviços
     */
    public function index()
    {
        return response()->json(Service::all());
    }

    /**
     * Criar novo serviço
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avg_service_time_minutes' => 'required|integer|min:1',
        ]);

        $service = Service::create($validated);

        return response()->json($service, 201);
    }

    /**
     * Mostrar serviço específico
     */
    public function show($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado'], 404);
        }

        return response()->json($service);
    }

    /**
     * Atualizar serviço
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'avg_service_time_minutes' => 'sometimes|required|integer|min:1',
        ]);

        $service->update($validated);

        return response()->json($service);
    }

    /**
     * Deletar serviço
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado'], 404);
        }

        $service->delete();

        return response()->json(null, 204);
    }
}
