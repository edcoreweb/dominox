<?php

namespace App\Listeners;

use App\WS\ValidationTrait;

abstract class WSListener
{
    use ValidationTrait;

    public function send($client, $event, $data = '', $status = 200)
    {
        return $client->send(json_encode([
            'data'   => $data,
            'status' => $status,
            'event'  => $event,
        ]));
    }
}
