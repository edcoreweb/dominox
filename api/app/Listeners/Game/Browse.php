<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Browse extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @return void
     */
    public function handle($message)
    {
        $message->reply(Game::open()->get());
    }
}
