<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class GetStarted extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @return void
     */
    public function handle($message)
    {
        $game = $message->user()->games()->first();

        $message->reply($game);
    }
}
