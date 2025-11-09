<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAuth
{
    /**
     * Handle an incoming request.
     * Aceita autenticação via sessão (web) ou token (sanctum)
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Tenta autenticar via sessão primeiro (para Inertia/Fortify)
        if (auth('web')->check()) {
            // Define o usuário autenticado para o guard padrão
            auth()->setUser(auth('web')->user());
            return $next($request);
        }

        // Se não estiver autenticado via sessão, tenta via Sanctum (token)
        $token = $request->bearerToken();
        if ($token) {
            // Tenta autenticar usando o token Sanctum
            // O método user('sanctum') valida automaticamente o token Bearer
            $user = $request->user('sanctum');
            
            if ($user) {
                // Define o usuário autenticado para o guard padrão
                auth()->setUser($user);
                return $next($request);
            }
        }

        // Para requisições JSON/API, retorna 401 se não autenticado
        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        // Para requisições web normais, permite passar (o middleware 'auth' vai tratar)
        return $next($request);
    }
}

