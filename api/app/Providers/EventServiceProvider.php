<?php

namespace App\Providers;

use Laravel\Lumen\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'chat' => ['App\Listeners\Chat'],
        'oauth.url' => ['App\Listeners\Auth\OAuthGetUrl'],
        'oauth.user' => ['App\Listeners\Auth\OAuthGetUser'],
        'api_token' => ['App\Listeners\Auth\TokenGetUser'],
        'game.create' => ['App\Listeners\Game\Create'],
    ];
}
