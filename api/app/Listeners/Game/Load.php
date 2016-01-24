<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Load extends WSListener
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

        if ($game->id != $message->user()->games()->first()->id) {
            return $message->reply('Game not found.', 404);
        }

        if ($game->status != 'started') {
            return $message->reply('Game not started.', 422);
        }

        $game->load('users');

        $message->reply($game);
    }
}
