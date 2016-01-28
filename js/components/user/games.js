import Auth from './../../Auth';

module.exports = {
    props: ['user'],

    template: require('./../../templates/user/games.html'),

    data() {
        return {
            games: [],
            total: 0,
            lost: 0,
            won: 0,
            user_id: Auth.user().id
        };
    },

    ready() {
        this.loadGames();
    },

    methods: {
        loadGames() {
            socket.send('user.games')
                .then((response) => {
                    this.games = response.data.games;
                    this.total = response.data.total;
                    this.won = response.data.won;
                    this.lost = response.data.lost;
                });
        }
    }
};
