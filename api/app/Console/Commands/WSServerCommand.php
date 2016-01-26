<?php

namespace App\Console\Commands;

use App\WS\Connection;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Illuminate\Console\Command;

class WSServerCommand extends Command
{
    /**
     * The web socket connection.
     *
     * @var \App\WS\Connection $connection
     */
    protected $connection;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ws:serve
                            {--port=9090 : The port to server sockets on.}
                            {--address=0.0.0.0 : The address to receive sockets on.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the web socket server.';

    /**
     * Create a new command instance.
     *
     * @param  \App\WS\Connection $connection
     * @return void
     */
    public function __construct(Connection $connection)
    {
        parent::__construct();

        $this->connection = $connection;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $address = $this->option('address');
        $port = intval($this->option('port'));

        $this->info('Starting web socket server on port ' . $port);

        $server = IoServer::factory(
            new HttpServer(new WsServer($this->connection)),
            $port, $address
        );

        $this->connection->setServer($server);

        $server->run();
    }
}
