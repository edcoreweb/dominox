module.exports = {
    props: ['user'],

    template: require('./../../templates/game/browse.html'),

    data() {
        return {
            games: [
                {
                    id: 1,
                    name: 'Room 1',
                    players: 2,
                    matches: 1,
                    points: 100
                },
                {
                    id: 2,
                    name: 'Room 2',
                    players: 4,
                    matches: 2,
                    points: 400
                },
                {
                    id: 3,
                    name: 'Room 3',
                    players: 3,
                    matches: 3,
                    points: 120
                }
            ]
        };
    },

    methods: {

    }
};
