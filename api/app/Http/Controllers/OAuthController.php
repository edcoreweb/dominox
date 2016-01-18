<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    /**
     * Get the redirect URL.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function url(Request $request)
    {
        $url = $this->provider($request)
                    ->redirect()->headers->get('Location');

        return $this->json($url);
    }

    /**
     * Get the user.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        $user = $this->provider($request)->user();

        $model = User::findByProvider($request->input('provider'), $user->getId());

        if ($model) {
            return $this->json($model);
        }

        $user = User::create([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'provider' => $request->input('provider'),
            'provider_id' => $user->getId(),
            'api_token' => str_random(32),
        ]);

        return $this->json($user, 201);
    }

    /**
     * @param  \Illuminate\Http\Request $request
     * @return \Laravel\Socialite\Contracts\Provider
     */
    protected function provider(Request $request)
    {
        return Socialite::driver($request->input('provider'))->stateless();
    }
}
