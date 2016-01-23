<?php

namespace App\WS;

use App\Models\User;
use Illuminate\Support\Arr;

class Message
{
    protected $data;
    protected $event;
    protected $message;
    protected $from;
    protected $user = null;
    protected $apiToken;

    /**
     * Create a new message instance.
     *
     * @param string $message
     */
    public function __construct($message, $from)
    {
        $this->message = $message;
        $this->from = $from;

        $this->parse();
    }

    public function setApiToken($token)
    {
        $this->apiToken = $token;
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

    public function get($key = null, $default = null)
    {
        return $this->data($key, $default);
    }

    public function all()
    {
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

    public function from()
    {
        return $this->from;
    }

    public function reply($data, $status = 200)
    {
        return $this->from->send(json_encode([
            'data'   => $data,
            'status' => $status,
            'event'  => $this->event
        ]));
    }

    public function user()
    {
        if (! isset($this->user)) {
            return $this->user = User::where('api_token', $this->apiToken)->first();
        }

        return $this->user;
    }
}
