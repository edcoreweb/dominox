<?php

namespace App\WS;

use Illuminate\Support\Arr;

class Message
{
    protected $data;
    protected $event;
    protected $message;

    /**
     * Create a new message instance.
     *
     * @param string $message
     */
    public function __construct($message)
    {
        $this->message = $message;

        $this->parse();
    }

    /**
     * Parse the message.
     *
     * @return void
     */
    protected function parse()
    {
        $message = json_decode($this->message, true);

        $this->data  = isset($message['d']) ? $message['d'] : null;
        $this->event = isset($message['e']) ? $message['e'] : null;
    }

    /**
     * Get the event name.
     *
     * @return string
     */
    public function event()
    {
        return $this->event;
    }

    /**
     * Get the message data.
     *
     * @param  string $key|null
     * @param  string $default|null
     * @return mixed
     */
    public function data($key = null, $default = null)
    {
        if ($key) {
            return Arr::get($this->data, $key, $default);
        }

        return $this->data;
    }

    /**
     * Get the message.
     *
     * @return string
     */
    public function message()
    {
        return $this->message;
    }
}
