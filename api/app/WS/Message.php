<?php

namespace App\WS;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Contracts\Support\Arrayable;

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

        $this->data = isset($message['data']) ? $message['data'] : null;
        $this->event = isset($message['event']) ? $message['event'] : null;
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

    public function only($keys)
    {
        return Arr::only($this->data, $keys);
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

    public function user()
    {
        if (! isset($this->user)) {
            return $this->user = User::where('api_token', $this->apiToken)->first();
        }

        return $this->user;
    }

    public function reply($data = '', $status = 200)
    {
        return static::sendTo($this->from, $this->event, $data, $status);
    }

    public static function sendTo($client, $event, $data = '', $status = 200)
    {
        if ($data instanceof Arrayable) {
            $data = $data->toArray();
        }

        return $client->send(json_encode(compact('data', 'event', 'status')));
    }
}
