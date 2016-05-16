<?php

$app->get('/', function () use ($app) {

    dd(app('notification.hub'));

    $hub = new App\NotificationHub\NotificationHub(
        env('NOTIFICATION_HUB_CONNECTION'),
        env('NOTIFICATION_HUB')
    );


    // 'https://android.googleapis.com/gcm/send/fHxJ2V4JzGg:APA91bEKFEQrg41XzblpJ2B6Q_Raxz0cgJ1GSk50a0nnl5fhwDu4zbBKfF61jav-1HqpVLCEGCNqeGIGnX8qGVNpPUI8xrEvTQRinESe0eFAETGdOGYugoctawLCwSDliairZF5oEmud'

    // $hub->createRegistration('fHxJ2V4JzGg:APA91bEKFEQrg41XzblpJ2B6Q_Raxz0cgJ1GSk50a0nnl5fhwDu4zbBKfF61jav-1HqpVLCEGCNqeGIGnX8qGVNpPUI8xrEvTQRinESe0eFAETGdOGYugoctawLCwSDliairZF5oEmud');

    // $hub->readRegistrations();

    // return generateSasToken('https://management.core.windows.net/1/services/ServiceBus/Namespaces/dominox/NotificationHubPnsCredentials/?api-version=2015-01', $hub->sasKeyName, $hub->sasKeyValue);

    $message = '{"data":{"message":"Hello from PHP!"}}';
    $notification = new App\NotificationHub\Notification("gcm", $message);
    $hub->sendNotification($notification, null);

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
