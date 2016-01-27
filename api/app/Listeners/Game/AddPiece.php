<?php

namespace App\Listeners\Game;

use App\Listeners\WSListener;

class AddPiece extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $game
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $conn)
    {
        // TODO: Validation.
        // if (invalid_move) abort();

        $game = $message->user()->games()->first();

        $user_id = $message->user()->id;
        $piece = $message->get('piece');
        $parent = $message->get('parent');
        $player_turn = $user_id == 1 ? 2 : 1;

        foreach ($conn->gameClients($game) as $client) {
            // if ($client != $message->from()) {
                $this->send($client, 'game.piece.added', compact('piece', 'parent', 'user_id', 'player_turn'));
            // }
        }

        echo "User " . $message->user()->name . " added piece " . $piece['name'] . "\n";
    }
}
