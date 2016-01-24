<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Join extends WSListener
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
        $game = Game::findByHash($message->get('hash'));

        if ($message->user()->hasGameStarted()) {
            $started = $message->user()->games()->first();

            if ($game->id != $started->id) {
                return $message->reply('You\'ve already started a game.', 422);
            }
        } else {
            $game->addUser($message->user());

            event('game.joined', [$game, $message->user(), $conn]);
        }

        $message->reply($game);
    }
}
