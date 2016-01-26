<?php

namespace App\Models;

trait PiecesTrait
{
    public function setPieces(array $pieces)
    {
        $this->pivot->pieces = json_encode($pieces);
        $this->pivot->save();
    }

    public function getPieces()
    {
        return json_decode($this->pivot->pieces, true);
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

    public function forEachPiece($callback)
    {
        return array_map($callback, $this->getPieces());
    }
}
