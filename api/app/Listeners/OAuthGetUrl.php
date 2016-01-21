<?php

namespace App\Listeners;

use Laravel\Socialite\Facades\Socialite;

class OAuthGetUrl extends WSListener
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
        $url = Socialite::driver($message->data('provider'))->stateless()
                        ->redirect()->headers->get('Location');

        return $this->send($from, $message->event(), $url);
    }
}
