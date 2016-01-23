<?php

namespace App\WS;

use SplObjectStorage;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Validation\ValidationException;

class Connection implements MessageComponentInterface
{
    /**
     * The event dispatcher.
     *
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $events;

    /**
     * The connected clients.
     *
     * @var \SplObjectStorage
     */
    protected $clients;

    /**
     * Create a new connection instance.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $events
     * @return void
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;

        $this->clients = new SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $message)
    {
        $message = new Message($message, $from);

        try {
            $this->events->fire($message->event(), [$message, $this]);
        } catch (ValidationException $e) {
            $message->reply($e->getResponse(), 422);
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /**
     * Get the connected clients.
     *
     * @return \SplObjectStorage
     */
    public function clients()
    {
        return $this->clients;
    }
}
