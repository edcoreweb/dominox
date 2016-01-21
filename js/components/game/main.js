// import Auth from './../../Auth';
import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

let rootNode = new Piece('1', false, 'root', null);

rootNode.addChildren([
    new Piece('2', false, 'left', null).addChildren([
        new Piece('3', true, 'up', 'up'),
        new Piece('4', true, 'down', 'down')
    ]),
    new Piece('7', false, 'right', null).addChildren([
        new Piece('5', true, 'up', 'up'),
        new Piece('6', true, 'down', 'down')
    ])
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
