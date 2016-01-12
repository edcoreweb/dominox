<?php

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->group(['middleware' => 'auth'], function () use ($app) {
    $app->get('me', function() use ($app) {
        return Auth::user();
    });
});
