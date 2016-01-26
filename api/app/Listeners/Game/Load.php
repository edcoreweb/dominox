<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;

class Load extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $conn)
    {
        $game = Game::findByHash($message->get('hash'));

        if ($game->id != $message->user()->games()->first()->id) {
            return $message->reply('Game not found.', 404);
        }

        if ($game->status != 'started') {
            return $message->reply('Game not started.', 422);
        }

        $game->load('users');

        if (! $game->player_turn) {
            $this->generatePieces($game);
        }

        // Current player pieces.
        $pieces = json_decode($game->users->find($message->user()->id)->pivot->pieces, true);

        $message->reply(compact('game', 'pieces'));
    }

    /**
     * Generate pieces for the game.
     *
     * @param  \App\Models\Game $game
     * @return void
     */
    protected function generatePieces($game)
    {
        $yard = $this->getDominoSet();

        // Give each user 6 pieces.
        foreach ($game->users as $user) {
            $user->setPieces($this->getRandomPieces($yard));
        }

        // Find the max double piece and user.
        list($maxPiece, $userId) = $this->findMaxDoublePiece($game, $yard);
        echo $maxPiece . ' : ' . $userId . "\n";

        $game->player_turn = $userId;
        $game->yard = $yard;
        $game->save();
    }

    /**
     * Find max double piece.
     *
     * @param  \App\Models\Game $game
     * @param  array &$yard
     * @return array [maxPiece, userId]
     */
    protected function findMaxDoublePiece($game, &$yard)
    {
        $maxPiece = '';
        $userId = null;

        foreach ($game->users as $user) {
            $user->forEachPiece(function ($piece) use (&$maxPiece, &$userId, $user) {
                if ($piece[0] == $piece[1] && $this->pieceGt($piece, $maxPiece)) {
                    $maxPiece = $piece;
                    $userId = $user->id;
                }
            });
        }

        // If no double piece was found, give a double piece to a random user.
        if (! $userId) {
            $pos = $this->getDoublePos($yard);

            $user = $game->users->random();
            $aux = $user->getPieceAt(0);
            $user->updatePieceAt(0, $yard[$pos]);

            $maxPiece = $yard[$pos];
            $userId = $user->id;

            $yard[$pos] = $aux;
        }

        return [$maxPiece, $userId];
    }

    /**
     * Extract random pieces from the given yard.
     *
     * @param  array   &$yard
     * @param  integer $amount
     * @return array
     */
    protected function getRandomPieces(&$yard, $amount = 6)
    {
        $pieces = [];

        $keys = array_rand($yard, $amount);

        foreach ($keys as $key) {
            $pieces[] = $yard[$key];

            unset($yard[$key]);
        }

        return $pieces;
    }

    /**
     * Get double piece possition.
     *
     * @param  array $pieces
     * @return int
     */
    protected function getDoublePos($pieces)
    {
        foreach ($pieces as $index => $piece) {
            if ($piece[0] == $piece[1]) {
                return $index;
            }
        }
    }

    /**
     * Compare piece $a with piece $b.
     *
     * @param  string $a
     * @param  string $b
     * @return bool
     */
    protected function pieceGt($a, $b)
    {
        if (! isset($b[0], $b[1])) {
            return true;
        }

        return (int) $a[0] + (int) $a[1] > (int) $b[0] + (int) $b[1];
    }

    /**
     * Get domino set.
     *
     * @return array
     */
    protected function getDominoSet()
    {
        $pieces = [];

        for ($i = 0; $i <= 6; $i++) {
            for ($j = 0; $j <= $i; $j++) {
                $pieces[] = (string) $i . $j;
            }
        }

        shuffle($pieces);

        print_r($pieces);

        return $pieces;
    }
}
