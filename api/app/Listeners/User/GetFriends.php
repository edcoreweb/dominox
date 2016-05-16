<?php

namespace App\Listeners\User;

use App\Models\User;
use App\Listeners\WSListener;

class GetFriends extends WSListener
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
        $tokens = $conn->getTokens();

        foreach ($tokens as $key => $value) {
            if ($value == $message->user()->api_token) {
                unset($tokens[$key]);
                break;
            }
        }

        $users = User::whereIn('api_token', $tokens)->get();

        $message->reply($users);
    }
}
