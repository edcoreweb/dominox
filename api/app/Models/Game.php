<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hash', 'name', 'players', 'matches', 'points', 'user_id'
    ];

    /**
     * Add a user to the game.
     *
     * @param \App\Models\User $user
     */
    public function addUser(User $user)
    {
        $this->users()->attach($user);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'game_players', 'game_id', 'user_id');
    }

    /**
     * Count the users that have joined the game.
     *
     * @return \Illuminate\Database\Query\Builder
     */
    public function countUsers()
    {
        return $this->users()
                    ->selectRaw('game_id, count(user_id) as aggregate')
                    ->groupBy('game_id');
    }

    /**
     * Scope a query to only include open games.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toArray()
    {
        $attributes = parent::toArray();

        if (isset($attributes['count_users'])) {
            $attributes['joined'] = (int) $attributes['count_users'][0]['aggregate'];
        }

        // Keep only the user id and name.
        if (isset($attributes['user'])) {
            $attributes['user'] = [
                'id'   => $attributes['user']['id'],
                'name' => $attributes['user']['name']
            ];
        }

        return $attributes;
    }
}
