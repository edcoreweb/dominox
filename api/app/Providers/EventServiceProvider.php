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

        // Authentication.
        'oauth.url'  => ['App\Listeners\Auth\OAuthGetUrl'],
        'oauth.user' => ['App\Listeners\Auth\OAuthGetUser'],
        'api_token'  => ['App\Listeners\Auth\TokenGetUser'],

        // Game.
        'game.create'  => ['App\Listeners\Game\Create'],
        'game.browse'  => ['App\Listeners\Game\Browse'],
        'game.join'    => ['App\Listeners\Game\Join'],
        'game.joined'  => ['App\Listeners\Game\Joined'],
        'game.leave'   => ['App\Listeners\Game\Leave'],
        'game.left'    => ['App\Listeners\Game\Left'],
        'game.delete'  => ['App\Listeners\Game\Delete'],
        'game.started' => ['App\Listeners\Game\Started'],
        'game.load'   => ['App\Listeners\Game\Load'],
        'game.piece.add' => ['App\Listeners\Game\AddPiece'],

        // User.
        'user.settings' => ['App\Listeners\User\UpdateSettings'],
    ];
}
