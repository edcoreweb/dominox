<?php

$app->get('/', function () use ($app) {
    //
});

$app->get('notification', function () use ($app) {
    $notif = \App\Models\Notification::orderBy('id', 'desc')->first();
    $payload = json_decode($notif->payload);

    return [
        'url' => 'http://localhost/dominox/#!/join/' . $payload->hash,
        'title' => 'You have been invited to a game!',
        'body' => $payload->name,
    ];
});
