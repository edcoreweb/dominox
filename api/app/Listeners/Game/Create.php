<?php

namespace App\Listeners\Game;

use App\Models\Game;
use Illuminate\Support\Str;
use App\Listeners\WSListener;

class Create extends WSListener
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
        if ($message->user()->hasGameStarted()) {
            return $message->reply(['You\'ve already started a game.'], 422);
        }

        $this->validate($message, [
            'name'    => 'required|between:2,100',
            'players' => 'required|numeric|min:2|max:4',
            'matches' => 'required|numeric|min:1|max:4',
            'points'  => 'required|numeric|min:10',
        ]);

        $game = Game::create([
            'hash'    => Str::random(32),
            'name'    => $message->get('name'),
            'players' => $message->get('players'),
            'matches' => $message->get('matches'),
            'points'  => $message->get('points'),
            'user_id' => $message->user()->id,
        ]);

        // Add the current user to the game.
        $game->addUser($message->user());

        $game->load('user', 'countUsers');

        // Send response the the user that created the game.
        $message->reply($game, 201);

        // Notify all users of a new game.
        foreach ($conn->clients() as $client) {
            $this->send($client, 'game.new', $game, 201);
        }
    }
}
