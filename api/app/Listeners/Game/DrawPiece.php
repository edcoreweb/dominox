<?php

namespace App\Listeners\Game;

use App\Listeners\WSListener;

class DrawPiece extends WSListener
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
        $game = $message->user()->startedGame();

        $user = $game->users->find($message->user()->id);

        if (! $user || $game->player_turn != $user->id) {
            return $message->reply('Not your turn.', 422);
        }

        // TODO: Validation.

        $piece = $game->randomPiece();

        if ($piece) {
            $user->addPiece($piece);
            $message->reply($piece);

            foreach ($conn->gameClients($game) as $client) {
                $this->send($client, 'game.piece.drawn', ['user_id' => $user->id]);
            }
        } else {
            // Game has ended!
        }
    }
}
