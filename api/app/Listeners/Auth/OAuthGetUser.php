<?php

namespace App\Listeners\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Listeners\WSListener;
use Laravel\Socialite\Facades\Socialite;

class OAuthGetUser extends WSListener
{
    /**
     * Handle the event.
     *
     * @param  \App\WS\Message $message
     * @param  \App\WS\Connection $conn
     * @return void
     */
    public function handle($message, $conn)
    {
        $request = Request::capture();
        $request->query->add(['code' => $message->data('code')]);

        $provider = $message->data('provider');

        $user = Socialite::driver($provider)->stateless()->setRequest($request)->user();

        if ($u = User::findByProvider($provider, $user->getId())) {
            return $this->send($message->from(), $message->event(), $u->setHidden([]));
        }

        if (User::where('email', $user->getEmail())->exists()) {
            return $this->send($message->from(), $message->event(), 'The email has already been taken.', 422);
        }

        $user = User::create([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'provider' => $provider,
            'provider_id' => $user->getId(),
            'api_token' => str_random(32),
        ]);

        return $this->send($message->from(), $message->event(), $user->setHidden([]), 201);
    }
}
