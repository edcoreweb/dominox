<?php

namespace App\Listeners\User;

use App\Listeners\WSListener;

class Subscribe extends WSListener
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
        $subscription = $message->get('subscription');

        if ($message->user()->subscription != $subscription) {
            $message->user()->subscription = $subscription;
            $message->user()->save();

            app()->make('notification.hub')->createRegistration($subscription);

            $message->reply('subscribed');
        } else {
            $message->reply('already subscribed');
        }
    }
}
