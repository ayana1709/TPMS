<?php

namespace App\Providers;

  use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;
use GuzzleHttp\Client;

class AppServiceProvider extends ServiceProvider
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
    Http::macro('chapaClient', function () {
        return Http::withOptions([
            'verify' => 'C:\cacert.pem',
        ]);
    });
}

}
