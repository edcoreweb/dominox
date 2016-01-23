// import Auth from './../../Auth';
import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

let rootNode = new Piece('66', false, 'root', null);

rootNode.addChildren([
    new Piece('56', false, 'left', null).addChildren([
        new Piece('23', true, 'up', 'up'),
        new Piece('04', true, 'down', 'down')
    ]),
    new Piece('13', false, 'right', null).addChildren([
        new Piece('42', true, 'up', 'up'),
        new Piece('22', true, 'down', 'down')
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
