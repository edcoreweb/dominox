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

        $game = $message->user()->startedGame();

        $user = $game->users->find($message->user()->id);

        if (! $user || $game->player_turn != $user->id) {
            return $message->reply('Not your turn.', 422);
        }

        $piece = $message->get('piece');
        $parent = $message->get('parent');

        if (! $user->hasPiece($piece['name'])) {
            return $message->reply('You don\'t have this piece ['.$piece['name'].'].', 422);
        }

        $user->removePiece($piece['name']);

        $game->addPiece($piece, $parent, $user->id);
        $game->player_turn = $this->nextPlayerTurn($game);

        if (! $user->hasPieces()) {
            $game->player_turn = null;
            $game->round += 1;
        }

        $game->save();

        foreach ($conn->gameClients($game) as $client) {
            $this->send($client, 'game.piece.added', [
                'piece' => $piece,
                'parent' => $parent,
                'user_id' => $user->id,
                'player_turn' => $game->player_turn,
            ]);
        }

        if (! $user->hasPieces()) {
            foreach ($conn->gameClients($game) as $client) {
                $this->send($client, 'game.won', $user);
            }
        }

        echo "User " . $message->user()->name . " added piece " . $piece['name'] . "\n";
    }

    /**
     * Get next player turn.
     *
     * @param  \App\Models\Game $game
     * @return int
     */
    protected function nextPlayerTurn($game)
    {
        foreach ($game->users as $offset => $user) {
            if ($user->id == $game->player_turn) {
                if ($offset == $game->users->count() - 1) {
                    return $game->users[0]->id;
                } else {
                    return $game->users[$offset + 1]->id;
                }
            }
        }
    }
}
