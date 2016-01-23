<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Delete extends WSListener
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
        $game->delete();

        foreach ($conn->clients() as $client) {
            $this->send($client, 'game.browse.delete', $game);
        }
    }
}
