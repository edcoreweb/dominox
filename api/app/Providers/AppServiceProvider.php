<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\NotificationHub\NotificationHub;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('notification.hub', function () {
            return new NotificationHub(
                env('NOTIFICATION_HUB_CONNECTION'),
                env('NOTIFICATION_HUB')
            );
        });
    }
}
