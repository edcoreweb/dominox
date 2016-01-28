<?php

namespace App\Models;

trait PiecesTrait
{
    public function addPoints($amount)
    {
        $this->pivot->points = (int) $this->pivot->points + $amount;
        $this->pivot->save();
    }

    public function getPoints()
    {
        return (int) $this->pivot->points;
    }

    public function setPieces(array $pieces)
    {
        $this->pivot->pieces = json_encode(array_values($pieces));
        $this->pivot->save();
    }

    public function getPieces()
    {
        return json_decode($this->pivot->pieces, true);
    }

    public function hasPieces()
    {
        return !! count($this->getPieces());
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

    public function addPiece($piece)
    {
        $pieces = $this->getPieces();

        $pieces[] = $piece;

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

    public function piecesSum()
    {
        $total = 0;

        $this->forEachPiece(function ($piece) use (&$total) {
            $total += (int) $piece[0] + (int) $piece[1];
        });

        return $total;
    }

    public function forEachPiece($callback)
    {
        return array_map($callback, $this->getPieces());
    }
}
