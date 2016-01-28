<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['yard'];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'players' => 'integer', 'player_turn' => 'integer', 'round' => 'integer', 'points' => 'integer'
    ];

    /**
     * Find game by hash.
     *
     * @param  string $hash
     * @return \App\Models\Game|null
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function findByHash($hash)
    {
        if ($game = static::where('hash', $hash)->first()) {
            return $game;
        }

        throw new ModelNotFoundException;
    }

    /**
     * Add user to the game.
     *
     * @param  \App\Models\User $user
     * @return void
     */
    public function addUser(User $user)
    {
        $this->users()->attach($user);
    }

    /**
     * Remove user from the game.
     *
     * @param  \App\Models\User $user
     * @return void
     */
    public function removeUser(User $user)
    {
        $this->users()->detach($user);
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
        return $this->belongsToMany(User::class, 'game_players', 'game_id', 'user_id')->withPivot('pieces', 'points');
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

    public function setYardAttribute($value)
    {
        $this->attributes['yard'] = json_encode(array_values($value));
    }

    public function getYardAttribute($value)
    {
        return json_decode($value, true);
    }

    public function addPiece($piece, $parent, $userId)
    {
        if ($parent) {
            $parent = $this->findPieceByName($parent['name']);
        }

        $this->pieces()->save(
            new GamePiece([
                'name' => $piece['name'],
                'vertical' => $piece['vertical'],
                'direction' => $piece['direction'],
                'corner' => $piece['corner'],
                'round' => $this->round,
                'user_id' => $userId,
                'parent_id' => $parent ? $parent->id : null,
            ])
        );
    }

    public function findPieceByName($name)
    {
        return $this->pieces()->where(function ($query) use ($name) {
            $query->where('name', $name)
                ->orWhere('name', strrev($name));
        })->first();
    }

    public function randomPiece()
    {
        $pieces = $this->yard;

        if (! count($pieces)) {
            return;
        }

        $piece = $pieces[0];

        unset($pieces[0]);

        $this->yard = $pieces;

        $this->save();

        return $piece;
    }

    public function clearPieces()
    {
        //
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pieces()
    {
        return $this->roundPieces($this->round);
    }

    public function roundPieces($round)
    {
        return $this->hasMany(GamePiece::class)->where('round', $round);
    }

    public function allPieces()
    {
        return $this->hasMany(GamePiece::class);
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
     * Scope a query to order by created at.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNewest($query)
    {
        return $query->orderBy('created_at', 'desc');
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
            if (count($attributes['count_users'])) {
                $attributes['joined'] = (int) $attributes['count_users'][0]['aggregate'];
            } else {
                $attributes['joined'] = 0;
            }
        }

        // Keep only the user id and name.
        if (isset($attributes['user'])) {
            $attributes['user'] = [
                'id'   => $attributes['user']['id'],
                'name' => $attributes['user']['name']
            ];
        }

        $attributes['yard_count'] = count($this->yard);

        return $attributes;
    }
}
