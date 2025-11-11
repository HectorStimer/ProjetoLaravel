<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
 |--------------------------------------------------------------------------
 | API Routes (DISABLED)
 |--------------------------------------------------------------------------
 |
 | This project is configured to run as an Inertia SPA only. The API routes
 | have been disabled to avoid duplicate/ambiguous endpoints. If you need
 | a JSON API in the future re-enable or restore from routes/api.php.bak
 |
 */

Route::any('/{any}', function (Request $request) {
    return response()->json([
        'message' => 'API disabled. This application runs as an Inertia SPA. Use web routes.',
    ], 410);
})->where('any', '.*');
