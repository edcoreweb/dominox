<?php

namespace App\WS;

use Exception;
use SplObjectStorage;
use Ratchet\Server\IoServer;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Validation\ValidationException;
use Symfony\Component\Console\Output\ConsoleOutput;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class Connection implements MessageComponentInterface
{
    /**
     * @var \Ratchet\Server\IoServer
     */
    protected $server;

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
     * User tokens. hash => token
     *
     * @var array
     */
    protected $tokens = [];

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

    /**
     * Handle new connection.
     *
     * @param  \Ratchet\ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    /**
     * Handle incoming message.
     *
     * @param  \Ratchet\ConnectionInterface $conn
     * @param  string $rawMessage
     * @return void
     */
    public function onMessage(ConnectionInterface $from, $rawMessage)
    {
        $message = new Message($rawMessage, $from);

        // Resolve user token.
        $this->resolveToken($message);

        // Check if the user is authenticated.
        if (! $this->authenticated($message)) {
            return $message->reply('Unauthorized', 401);
        }

        // Fire event.
        try {
            $this->events->fire($message->event(), [$message, $this]);
        } catch (ValidationException $e) {
            $message->reply($e->getResponse(), 422);
        } catch (ModelNotFoundException $e) {
            $message->reply('Not found.', 404);
        }
    }

    /**
     * Handle connection closed.
     *
     * @param  \Ratchet\ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn)
    {
        $this->forgetToken($conn);

        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    /**
     * Handle connection error.
     * @param  \Ratchet\ConnectionInterface $conn
     * @param  \Exception $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, Exception $e)
    {
        $conn->close();

        $this->renderException($e);
    }

    /**
     * Resolve user token.
     *
     * @param  \App\WS\Message $message
     * @return void
     */
    protected function resolveToken(Message $message)
    {
        $conn = $message->from();
        $hash = $this->clients->getHash($conn);

        if (! isset($this->tokens[$hash])) {
            if ($token = $message->get('api_token')) {
                $this->tokens[$hash] = $token;
            } else {
                $this->tokens[$hash] = null;
            }
        }

        $message->setApiToken($this->tokens[$hash]);
    }

    /**
     * Forget client token.
     *
     * @param  \Ratchet\ConnectionInterface $conn
     * @return void
     */
    protected function forgetToken(ConnectionInterface $conn)
    {
        $hash = $this->clients->getHash($conn);

        unset($this->tokens[$hash]);
    }

    /**
     * Determine if the user is authenticated.
     *
     * @param  \App\WS\Message $message
     * @return bool
     */
    protected function authenticated(Message $message)
    {
        if (in_array($message->event(), ['oauth.url', 'oauth.user', 'api_token'])) {
            return true;
        }

        return $message->user();
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

    /**
     * Set the IO server.
     *
     * @param  \Ratchet\Server\IoServer $server
     * @return void
     */
    public function setServer($server)
    {
        $this->server = $server;
    }

    /**
     * Get the server IO instance.
     *
     * @return \Ratchet\Server\IoServer
     */
    public function server()
    {
        return $this->server;
    }

    public function loop()
    {
        return $this->server->loop;
    }

    /**
     * Get game clients.
     *
     * @param  \App\Models\Game $game
     * @return array
     */
    public function gameClients($game)
    {
        $clients = [];

        foreach ($game->users as $user) {
            $hash = array_search($user->api_token, $this->tokens);

            foreach ($this->clients as $client) {
                if ($this->clients->getHash($client) == $hash) {
                    $clients[] = $client;
                    continue;
                }
            }
        }

        return $clients;
    }

    /**
     * Render exception.
     *
     * @param  \Exception $e
     * @return void
     */
    protected function renderException(Exception $e)
    {
        app('Illuminate\Contracts\Debug\ExceptionHandler')->renderForConsole(new ConsoleOutput, $e);
    }
}
