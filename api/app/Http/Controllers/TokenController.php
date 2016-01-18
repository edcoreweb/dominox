<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TokenController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function post(Request $request)
    {
        $user = User::findByToken($request->input('api_token'));

        return $this->json($user);
    }
}
