<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

class LogoutController extends BaseController
{
    /**
     * Handle the logout request.
     */
    public function __invoke(Request $request)
    {
        // Log the user out of the session
        Auth::logout();

        // Invalidate and regenerate session token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to home (will be intercepted by Inertia middleware)
        // After logout, user should not see dashboard button anymore
        return redirect('/');
    }
}
