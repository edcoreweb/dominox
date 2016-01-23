module.exports = {
    props: ['user'],

    template: require('./../../templates/game/browse.html'),

    data() {
        return {
            games: []
        };
    },

    ready() {
        // Fetch the open games.
        socket.send('game.browse')
            .then((response) => {
                this.games = response.data;
            });

        // Listen for new games.
        socket.on('game.browse.new', (response) => {
            this.games.unshift(response.data);
        });
    },

    methods: {

    }
};
