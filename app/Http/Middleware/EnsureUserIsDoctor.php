<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsDoctor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || (!$user->isDoctor() && !$user->isAdmin())) {
            abort(403, 'Acesso negado. Apenas médicos podem realizar esta ação.');
        }

        return $next($request);
    }
}

