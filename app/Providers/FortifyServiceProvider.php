<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Auth\Events\Logout;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
    // Keep Fortify routes enabled so password reset and other Fortify endpoints remain available.
    $this->configureActions();
    // Views are handled by our own controllers and Inertia pages. Skip Fortify view bindings.
    // $this->configureViews();
        $this->configureRateLimiting();
        $this->configureLogout();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        // Registration is handled by a custom controller (App\Http\Controllers\Auth\AuthController)
        // Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure logout to clean up Sanctum tokens.
     */
    private function configureLogout(): void
    {
        Event::listen(Logout::class, function ($event) {
            if ($event->user) {
                // Deletar todos os tokens do Sanctum quando o usuário faz logout
                // Só tenta deletar se a tabela do Sanctum existir para evitar erros
                if (Schema::hasTable('personal_access_tokens')) {
                    try {
                        $event->user->tokens()->delete();
                    } catch (\Throwable $e) {
                        // Falha ao deletar tokens — registrar silentamente para não quebrar o logout
                        report($e);
                    }
                }
            }
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        // Views are provided by our controllers/Inertia pages. Fortify view bindings have been disabled.
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
