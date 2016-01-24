<?php

namespace App\Listeners\Game;

use App\Listeners\WSListener;

class Start extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\Models\Game $game
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($game, $conn)
    {
        foreach ($conn->gameClients($game) as $client) {
            $this->send($client, 'game.start', $game);
        }
    }
}
