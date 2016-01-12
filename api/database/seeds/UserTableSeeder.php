<?php

use App\Models\User;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'Cretu Eusebiu',
                'email' => 'cretu.eusebiu@gmail.com',
            ],
            [
                'name' => 'Tofan Eduard',
                'email' => 'tofan.eduard@gmail.com',
            ]
        ];

        foreach ($users as $user) {
            $user['password'] = app('hash')->make('test123');
            $user['api_token'] = str_random(32);

            User::create($user);
        }
    }
}
