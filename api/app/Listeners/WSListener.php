<?php

namespace App\Listeners;

abstract class WSListener
{
    public function send($client, $event, $data = '', $status = 200)
    {
        return $client->send(json_encode([
            'data'   => $data,
            'status' => $status,
            'event'  => $event,
        ]));
    }
}
