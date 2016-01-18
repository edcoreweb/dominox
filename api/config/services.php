<?php

$redirect = 'http://dominox.app/oauth-handler.html';

return [

    'facebook' => [
        'client_id'     => env('FACEBOOK_ID'),
        'client_secret' => env('FACEBOOK_SECRET'),
        'redirect'      => $redirect,
    ],

    'google' => [
        'client_id'     => env('GOOGLE_ID'),
        'client_secret' => env('GOOGLE_SECRET'),
        'redirect'      => $redirect,
    ]
];