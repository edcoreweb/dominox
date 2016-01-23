<?php

namespace App\Listeners\Game;

use App\Models\Game;
use App\Listeners\WSListener;
use Illuminate\Validation\ValidationException;

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
        if ($message->user()->hasOpenGames()) {
            // return $message->reply(['You already gave a game open.'], 400);
        }

        $this->validate($message, [
            'name'    => 'required|between:2,100',
            'players' => 'required|numeric|min:2|max:4',
            'matches' => 'required|numeric|min:1|max:4',
            'points'  => 'required|numeric|min:10',
        ]);

        $game = Game::create([
            'name'    => $message->get('name'),
            'players' => $message->get('players'),
            'matches' => $message->get('matches'),
            'points'  => $message->get('points'),
            'user_id' => $message->user()->id,
        ]);

        $message->reply($game, 201);

        foreach ($conn->clients() as $client) {
            $this->send($client, 'game.browse.new', $game, 201);
        }
    }
}
