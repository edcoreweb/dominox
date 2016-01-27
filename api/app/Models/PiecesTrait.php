<?php

namespace App\Models;

trait PiecesTrait
{
    public function setPieces(array $pieces)
    {
        $this->pivot->pieces = json_encode(array_values($pieces));
        $this->pivot->save();
    }

    public function getPieces()
    {
        return json_decode($this->pivot->pieces, true);
    }

    public function hasPiece($piece)
    {
        return in_array($piece, $this->getPieces()) || in_array(strrev($piece), $this->getPieces());
    }

    public function getPieceAt($pos)
    {
        return $this->getPieces()[$pos];
    }

    public function updatePieceAt($pos, $piece)
    {
        $pieces = $this->getPieces();

        $pieces[$pos] = $piece;

        $this->setPieces($pieces);
    }

    public function removePiece($piece)
    {
        $pieces = $this->getPieces();

        foreach ($pieces as $key => $value) {
            if ($piece == $value || strrev($piece) == $value) {
                unset($pieces[$key]);
                unset($pieces[strrev($key)]);

                $this->setPieces($pieces);

                return true;
            }
        }

        return false;
    }

    public function forEachPiece($callback)
    {
        return array_map($callback, $this->getPieces());
    }
}
