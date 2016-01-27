<?php

namespace App\Listeners\Game;

use App\Listeners\WSListener;

class Left extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\Models\Game $game
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($game, $user, $conn)
    {
        $game->load('countUsers');

        foreach ($conn->clients() as $client) {
            $this->send($client, 'game.update', $game);
        }

        foreach ($conn->gameClients($game) as $client) {
            $this->send($client, 'game.left', $user);
        }
    }
}
