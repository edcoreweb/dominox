<?php

namespace App\Listeners\Auth;

use App\Models\User;
use App\Listeners\WSListener;

class TokenGetUser extends WSListener
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
        $user = User::findByToken($message->data('api_token'));

        return $this->send($message->from(), $message->event(), $user->setVisible([]));
    }
}
