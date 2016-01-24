import Const from './Const';
import Point from './Point';

class Rectangle {
    /**
     * Create a new piece instance.
     */
    constructor(startX, startY, width, height) {
        this.startX = startX;
        this.startY = startY;
        this.vertical = vertical;

        this.width = width;
        this.height = height;

        this.coords = this.generateCoords();

        return this;
    }

    generateCoords() {
        return {
            'X1': this.startX,
            'X2': this.startX + this.width,
            'Y1': this.startY,
            'Y2': this.startY + this.height,
        };
    }

    getCoords() {
        return this.coords;
    }

    isOverlapping(rectangle) {
        let otherCoords = rectangle.getCoords();
        let myCoords = this.coords;

        if (myCoords.X1 < otherCoords.X2 && myCoords.X2 > otherCoords.X1 &&
            myCoords.Y1 < otherCoords.Y2 && myCoords.Y2 > otherCoords.Y1) {
            return true;
        }

        return false;
    }
}

module.exports = Rectangle;
