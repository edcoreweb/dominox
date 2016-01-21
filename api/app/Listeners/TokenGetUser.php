<?php

namespace App\Listeners;

use App\Models\User;

class TokenGetUser extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \Ratchet\ConnectionInterface $from
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $from, $conn)
    {
        $user = User::findByToken($message->data('api_token'));

        return $this->send($from, $message->event(), $user);
    }
}
