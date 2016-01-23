<?php

namespace App\Listeners\Auth;

use App\Listeners\WSListener;
use Laravel\Socialite\Facades\Socialite;

class OAuthGetUrl extends WSListener
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
        $url = Socialite::driver($message->data('provider'))->stateless()
                        ->redirect()->headers->get('Location');

        return $this->send($message->from(), $message->event(), $url);
    }
}
