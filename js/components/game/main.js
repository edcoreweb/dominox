// import Auth from './../../Auth';
// import Piece from './../../Piece';
import './bone';
import 'jquery.panzoom';

var data = {
    name: '1',
    corner: null,
    vertical: false,
    direction: 'center',
    children: [
        {
            name: '2',
            corner: null,
            vertical: false,
            direction: 'left',
            children: [

            ]
        },

        {
            name: '3',
            corner: null,
            vertical: true,
            direction: 'up',
            children: [

                {
                    name: '20',
                    corner: 'up',
                    vertical: false,
                    direction: 'up',
                    children: [

                    ]
                }

            ]
        },

        {
            name: '4',
            corner: null,
            vertical: true,
            direction: 'down',
            children: [

                {
                    name: '21',
                    corner: 'down',
                    vertical: false,
                    direction: 'down',
                    children: [

                    ]
                }

            ]
        },

        {
            name: '5',
            corner: null,
            vertical: false,
            direction: 'right',
            children: [

                {
                    name: '6',
                    corner: 'down',
                    vertical: true,
                    direction: 'right',
                    children: [

                        {
                            name: '8',
                            corner: null,
                            vertical: true,
                            direction: 'up',
                            children: [

                                {
                                    name: '10',
                                    corner: null,
                                    vertical: true,
                                    direction: 'up',
                                    children: [

                                    ]
                                }

                            ]
                        },

                        {
                            name: '9',
                            corner: null,
                            vertical: true,
                            direction: 'down',
                            children: [

                            ]
                        },

                        {
                            name: '7',
                            corner: 'down',
                            vertical: false,
                            direction: 'right',
                            children: [

                                {
                                    name: '11',
                                    corner: 'down',
                                    vertical: true,
                                    direction: 'up',
                                    children: [

                                        {
                                            name: '12',
                                            corner: null,
                                            vertical: true,
                                            direction: 'up',
                                            children: [

                                                {
                                                    name: '13',
                                                    corner: 'up',
                                                    vertical: false,
                                                    direction: 'right',
                                                    children: [

                                                    ]
                                                }

                                            ]
                                        }

                                    ]
                                }

                            ]
                        }

                    ]
                }

                // {
                //     name: '12',
                //     corner: null,
                //     vertical: false,
                //     direction: 'down',
                //     children: [

                //     ]
                // },

                // {
                //     name: '5',
                //     corner: null,
                //     vertical: false,
                //     direction: 'right',
                //     children: [

                //         {
                //             name: '6',
                //             corner: null,
                //             vertical: true,
                //             direction: 'right',
                //             children: [

                //                 {
                //                     name: '13',
                //                     corner: null,
                //                     vertical: false,
                //                     direction: 'up',
                //                     children: [

                //                     ]
                //                 },

                //                 {
                //                     name: '14',
                //                     corner: null,
                //                     vertical: false,
                //                     direction: 'down',
                //                     children: [

                //                     ]
                //                 },

                //                 {
                //                     name: '7',
                //                     corner: null,
                //                     vertical: false,
                //                     direction: 'right',
                //                     children: [

                //                     ]
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ]
        }
    ]
};

module.exports = {
    template: require('./../../templates/game/main.html'),

    data() {
        return {
            selected: null,
            boardData: data
        };
    },

    ready() {

        var $panzoom = $('.outer-div').panzoom();
        $panzoom.parent().on('mousewheel.focal', function( e ) {
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
                increment: 0.1,
                animate: false,
                focal: e
            });
        });
    },

    methods: {
        add(direction) {
            console.log(direction);
        }
    }
};
