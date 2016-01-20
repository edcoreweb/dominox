<?php

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->post('api_token', 'TokenController@post');
$app->post('oauth/url', 'OAuthController@url');
$app->post('oauth/user', 'OAuthController@user');

$app->group(['middleware' => 'auth'], function () use ($app) {
    $app->get('me', function() use ($app) {
        return Auth::user();
    });

    $app->patch('me', function() use ($app) {
    });
});
