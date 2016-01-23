<?php

namespace App\Listeners;

class Chat extends WSListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $conn)
    {
        $clients = $conn->clients();

        foreach ($clients as $client) {
            if ($message->from() !== $client) {
                $this->send($client, $message->event(), $message->data());
            }
        }
    }
}
