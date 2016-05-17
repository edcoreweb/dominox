<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Laravel\Lumen\Http\ResponseFactory;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function notification()
    {
        $token = app('request')->get('_api_token');

        $user = User::where('api_token', $token)->first();

        if (! $token) {
            return response()->json('Not found.', 404);
        }

        $notif = Notification::where('user_id', $user->id)->orderBy('id', 'desc')->first();

        if (! $notif) {
            return response()->json('Not found.', 404);
        }

        $payload = json_decode($notif->payload);

        $notif->delete();

        $port = $_SERVER['SERVER_PORT'];

        $url = env('APP_URL');

        if ($port == '8080') {
            $url = str_replace('localhost', 'localhost:8080', $url);
        }

        return [
            'url' => $url . '/#!/join/' . $payload->hash,
            'title' => 'You have been invited to a game!',
            'body' => $payload->name,
            'user_id' => (int) $notif->user_id,
            'token' => $token
        ];
    }
}
