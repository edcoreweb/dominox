<?php

namespace App\Listeners\User;

use App\Listeners\WSListener;

class Games extends WSListener
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
        $user = $message->user();

        $games = $user->finishedGames()->get();

        $total = $games->count();

        $won = $games->where('winner', $user->id)->count();

        $message->reply([
            'games' => $games,
            'total' => $total,
            'lost' => $total - $won,
            'won' => $won,
        ]);
    }
}
