<?php

namespace App\Listeners;

use App\WS\Message;
use App\WS\ValidationTrait;

abstract class WSListener
{
    use ValidationTrait;

    public function send($client, $event, $data = '', $status = 200)
    {
        return Message::sendTo($client, $event, $data, $status);
    }
}
