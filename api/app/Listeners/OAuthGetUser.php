<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class OAuthGetUser extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \Ratchet\ConnectionInterface $from
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $from, $conn)
    {
        $request = Request::capture();
        $request->query->add(['code' => $message->data('code')]);

        $provider = $message->data('provider');

        $user = Socialite::driver($provider)->stateless()->setRequest($request)->user();

        if ($u = User::findByProvider($provider, $user->getId())) {
            return $this->send($from, $message->event(), $u);
        }

        if (User::where('email', $user->getEmail())->exists()) {
            return $from->send(['response' => 'The email has already been taken.', 'status' => 422]);
        }

        $user = User::create([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'provider' => $provider,
            'provider_id' => $user->getId(),
            'api_token' => str_random(32),
        ]);

        return $this->send($from, $message->event(), $user, 201);
    }
}
