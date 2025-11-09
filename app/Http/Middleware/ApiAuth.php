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
        if ($request->bearerToken()) {
            if (auth('sanctum')->check()) {
                auth()->setUser(auth('sanctum')->user());
                return $next($request);
            }
        }

        // Para requisições Inertia/Ajax, verifica se há sessão ativa
        if ($request->expectsJson() || $request->wantsJson()) {
            // Se for requisição JSON mas não autenticado, retorna 401
            return response()->json(['message' => 'Não autenticado'], 401);
        }

        // Para requisições web normais, permite passar (o middleware 'auth' vai tratar)
        return $next($request);
    }
}

