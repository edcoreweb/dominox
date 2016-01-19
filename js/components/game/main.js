import Auth from './../../Auth';
import Piece from './../../Piece';
import Bone from './bone';

var data = {
  name: '1',
  corner: false,
  vertical: false,
  direction: 'center',
  children: [
    {
        name: '2',
        corner: false,
        vertical: false,
        direction: 'left',
        children: [

            {
                name: '3',
                corner: false,
                vertical: true,
                direction: 'left',
                children: [

                    {
                        name: '8',
                        corner: false,
                        vertical: false,
                        direction: 'up',
                        children: [

                        {
                            name: '20',
                            corner: false,
                            vertical: true,
                            direction: 'up',
                            children: [

                            ]
                        },

                        ]
                    },

                    {
                        name: '9',
                        corner: false,
                        vertical: false,
                        direction: 'down',
                        children: [

                        ]
                    },

                    {
                        name: '10',
                        corner: false,
                        vertical: false,
                        direction: 'left',
                        children: [

                        ]
                    },

                ]
            },

        ]
    },

    {
        name: '4',
        corner: false,
        vertical: true,
        direction: 'right',
        children: [

            {
                name: '11',
                corner: false,
                vertical: false,
                direction: 'up',
                children: [

                ]
            },

            {
                name: '12',
                corner: false,
                vertical: false,
                direction: 'down',
                children: [

                ]
            },

            {
                name: '5',
                corner: false,
                vertical: false,
                direction: 'right',
                children: [

                    {
                        name: '6',
                        corner: false,
                        vertical: true,
                        direction: 'right',
                        children: [

                            {
                                name: '13',
                                corner: false,
                                vertical: false,
                                direction: 'up',
                                children: [

                                ]
                            },

                            {
                                name: '14',
                                corner: false,
                                vertical: false,
                                direction: 'down',
                                children: [

                                ]
                            },

                            {
                                name: '7',
                                corner: false,
                                vertical: false,
                                direction: 'right',
                                children: [

                                ]
                            },

                        ]
                    },

                ]
            },

        ]
    },
  ]
};

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
            boardData: data,
        }
    },

    ready() {
    },

    methods: {
        add(direction) {

        }
    }
};
