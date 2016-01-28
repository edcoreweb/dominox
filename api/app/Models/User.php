<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, PiecesTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'avatar', 'api_token', 'provider', 'provider_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'email', 'created_at', 'updated_at', 'api_token', 'provider', 'provider_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = ['id' => 'integer'];

    /**
     * Find user by api token.
     *
     * @param  string $token
     * @return $this
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public static function findByToken($token)
    {
        $user = static::where('api_token', $token)->first();

        if (! is_null($user)) {
            return $user;
        }

        throw new ModelNotFoundException;
    }

    /**
     * Find user by provider.
     *
     * @param  string $provider
     * @param  string $id
     * @return $this
     */
    public static function findByProvider($provider, $id)
    {
        return static::where('provider', $provider)
                     ->where('provider_id', $id)
                     ->first();
    }

    public function startedGame()
    {
        return $this->games->where('status', 'started')->first();
    }

    public function openGame()
    {
        return $this->games->where('status', 'open')->first();
    }

    public function activeGame()
    {
        return $this->games()->whereIn('status', ['open', 'started'])->first();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function games()
    {
        return $this->belongsToMany(Game::class, 'game_players', 'user_id', 'game_id');
    }

    /**
     * Convert the model instance to an array.
     *
     * @return array
     */
    public function toArray()
    {
        $attributes = parent::toArray();

        if (isset($this->pivot)) {
            $attributes['points'] = $this->getPoints();
            $attributes['pieces']  = count($this->getPieces());
        }

        return $attributes;
    }
}
