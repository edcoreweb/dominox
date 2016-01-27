Vue.component('boneyard', {
    props: ['pieces'],

    template: require('./../../templates/game/boneyard.html'),

    data() {
        return {
            disabled: false
        };
    },

    methods: {

    }
});
