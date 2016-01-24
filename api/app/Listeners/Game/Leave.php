<?php

namespace App\Listeners\Game;

use App\Listeners\WSListener;

class Leave extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $conn)
    {
        $user = $message->user();

        if ($game = $user->games()->first()) {
            $game->removeUser($user);
            event('game.left', [$game, $user, $conn]);
        }

        // If the game has no users left, fire event to delete it.
        if (! $game->users()->count()) {
            event('game.delete', [$game, $conn]);
        }

        $message->reply(null, 204);
    }
}
