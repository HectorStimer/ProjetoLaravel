<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function register(Request $request)
{
    $userFunctions = ["admin", "triagist", "doctor"];

    $validated = $request->validate([
        'name' => 'required|string|max:50',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6|confirmed',
        'function' => 'required|string'
    ]);

    if (!in_array($request->function, $userFunctions)) {
        return response()->json(['message' => 'Função de usuário inválida'], 422);
    }

    $validated['password'] = Hash::make($validated['password']);
    $user = User::create($validated);
    

    

    $user->function = $request->function;
    $user->save();

    $token = $user->createToken('api-token')->plainTextToken;

    if ($user->function === 'admin') {
        return response()->json([
            'message' => 'Usuário administrador criado com sucesso',
            'token' => $token,
            'user' => $user,
            'redirect' => '/api/dashboard/admin'
        ], 201);
    } elseif ($user->function === 'triagist') {
        return response()->json([
            'message' => 'Triagista registrado com sucesso',
            'token' => $token,
            'user' => $user,
            'redirect' => '/api/dashboard/triagist'
        ], 201);
    } elseif ($user->function === 'doctor') {
        return response()->json([
            'message' => 'Médico registrado com sucesso',
            'token' => $token,
            'user' => $user,
            'redirect' => '/api/dashboard/doctor'
        ], 201);
    }
    
    return response()->json([
        'message' => 'Usuário criado com sucesso',
        'token' => $token,
        'user' => $user,
    ], 201);
}

    public function login(Request $request){
        // Este método é apenas para API REST
        // O login via web usa Fortify diretamente
        $credentials = $request->validate([
            'email'=>'required|email',
            'password'=>'required|string'
        ]);
        
        if(!Auth::attempt($credentials)){
            return response()->json(['message'=>'Credenciais inválidas'],401);
        }
        
        $user = $request->user();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    
    public function logout(Request $request)
    {
        // Verifica se o usuário está autenticado
        $user = $request->user();
    
        if ($user) {
            // Revoga APENAS o token atual
            $user->currentAccessToken()->delete();
    
            return response()->json([
                'message' => 'Logout realizado com sucesso!'
            ], 200);
        }
    
        return response()->json([
            'message' => 'Usuário não autenticado.'
        ], 401);
    }
    