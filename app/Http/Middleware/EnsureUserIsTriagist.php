<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsTriagist
{
   
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || (!$user->isTriagist() && !$user->isAdmin())) {
            abort(403, 'Acesso negado. Apenas triagistas podem realizar esta ação.');
        }

        return $next($request);
    }
}

