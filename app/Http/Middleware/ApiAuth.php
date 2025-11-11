<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuth
{
    
    public function handle(Request $request, Closure $next): Response
    {
        //autenticação via sessão (web)
        if (auth('web')->check()) {
            // Define o usuário autenticado para o guard padrão
            auth()->setUser(auth('web')->user());
            return $next($request);
        }

        // se nao, via sanctum token
        $token = $request->bearerToken();
        if ($token) {
            
            $user = $request->user('sanctum');
            
            if ($user) {
                // Define o usuário autenticado para o guard padrão
                auth()->setUser($user);
                return $next($request);
            }
        }

        // 401 se nao autenticado
        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        // Para requisições web normais, permite passar (o middleware 'auth' vai tratar)
        return $next($request);
    }
}

