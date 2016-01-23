<?php

namespace App\Listeners\User;

use App\Listeners\WSListener;

class UpdateSettings extends WSListener
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
        $user = $message->user();

        $this->validate($message, [
            'name'  => 'required|between:2,100',
            'email' => 'required|email|max:200|unique:users,email,'.$user->id,
        ]);

        $user->name = e($message->get('name'));
        $user->email = e($message->get('email'));
        $user->save();

        $message->reply($user);
    }
}
