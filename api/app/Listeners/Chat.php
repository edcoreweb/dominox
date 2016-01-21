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
     * @param  \Ratchet\ConnectionInterface $from
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $from, $conn)
    {
        $clients = $conn->getClients();

        foreach ($clients as $client) {
            if ($from !== $client) {
                $this->send($client, $message->event(), $message->data());
            }
        }
    }
}
