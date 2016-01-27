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
        'name', 'vertical', 'direction', 'corner', 'parent_id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = ['id' => 'integer', 'parent_id' => 'integer', 'vertical' => 'boolean'];

    public static function findByName($name)
    {
        return static::where('name', $name)
                     ->orWhere('name', strrev($name))
                     ->first();
    }
}
