<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamePiece extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'vertical', 'direction', 'corner', 'parent_id', 'round', 'user_id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'parent_id' => 'integer',
        'vertical' => 'boolean',
        'round' => 'integer',
        'user_id' => 'integer'
        'game_id' => 'integer'
    ];
}
