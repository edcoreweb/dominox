<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Started extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @return void
     */
    public function handle($message)
    {
        $game = $message->user()->activeGame();

        $message->reply($game);
    }
}
