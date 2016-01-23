import Vue from 'vue';

Vue.component('navbar', {
    props: ['user'],

    template: require('./../templates/partials/navbar.html'),

    data() {
        return {
        };
    },
    components: {
        'user-profile': require('./user/profile'),
        'user-settings': require('./user/settings'),
        'create-game': require('./game/create')
    },

    methods: {
        is(name) {
            return this.$route.name == name;
        }
    }
});
