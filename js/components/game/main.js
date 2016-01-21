// import Auth from './../../Auth';
import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

let rootNode = new Piece('1', false, 'root', null);

rootNode.addChildren([
    new Piece('2', false, 'left', null),
    new Piece('3', true, 'left', 'up'),
    new Piece('4', true, 'left', 'down'),
    new Piece('5', true, 'right', 'up'),
    new Piece('6', true, 'right', 'down'),
    new Piece('7', false, 'right', null)
]);

var playerCards = [
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'root'
    },
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'right'
    },
    {
        name: '1',
        corner: null,
        vertical: true,
        direction: 'right'
    }
];

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
            root: rootNode,
            bones: playerCards
        };
    },

    ready() {

    },

    methods: {
        add(direction) {
            console.log(direction);
        }
    }
};
