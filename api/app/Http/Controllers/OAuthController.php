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
        $url = $this->provider($request->input('provider'))
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
        $provider = $request->input('provider');

        $user = $this->provider($provider)->user();

        if ($u = User::findByProvider($provider, $user->getId())) {
            return $this->json($u);
        }

        if (User::where('email', $user->getEmail())->exists()) {
            return $this->json(['The email has already been taken.'], 422);
        }

        $user = User::create([
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'provider' => $provider,
            'provider_id' => $user->getId(),
            'api_token' => str_random(32),
        ]);

        return $this->json($user, 201);
    }

    /**
     * @param  string $provider
     * @return \Laravel\Socialite\Contracts\Provider
     */
    protected function provider($provider)
    {
        return Socialite::driver($provider)->stateless();
    }
}
