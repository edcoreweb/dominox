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
     * @return void
     */
    public function handle($message)
    {
        if ($message->user()->hasGameStarted()) {
            return $message->reply('You\'ve already started a game.', 422);
        }

        $game = Game::findByHash($message->get('hash'));

        $game->addUser($message->user());

        $message->reply(true);
    }
}
