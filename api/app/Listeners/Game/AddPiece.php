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

        $user_id = $message->user();
        $piece = $message->get('piece');
        $parent = $message->get('parent');

        foreach ($conn->gameClients($game) as $client) {
            if ($client != $message->from()) {
                $this->send($client, 'game.piece.add', compact('piece', 'parent', 'user_id'));
            }
        }

        echo "User " . $message->user()->name . " add piece " . $piece['name'] . "\n";
    }
}
