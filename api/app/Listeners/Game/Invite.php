<?php

namespace App\Listeners\Game;

use App\Models\User;
use App\Models\Game;
use App\Listeners\WSListener;

class Invite extends WSListener
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
        $userId = $message->get('user_id');

        $game = $message->user()->activeGame();

        User::find($userId)->addNotification($game);
    }
}
