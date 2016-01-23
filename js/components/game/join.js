module.exports = {
    template: require('./../../templates/game/join.html'),

    data() {
        return {

        };
    },

    methods: {
        leave() {
            this.$router.go({name: 'game.browse'});
        }
    }
};
