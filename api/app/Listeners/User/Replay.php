<?php

namespace App\Listeners\User;

use App\Models\Game;
use App\Listeners\WSListener;

class Replay extends WSListener
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

        $hash = $message->get('hash');

        $game = Game::findByHash($hash);

        $game->load('users', 'allPieces');

        $message->reply($game);
    }
}
