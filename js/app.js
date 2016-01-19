import './bootstrap';
import router from './router';

let App = Vue.extend({
    data() {
        return {
            user: null,
            busy: true,
        };
    },

    ready() {
        this.$on('user.login', this.userHasLoggedIn);
        this.$on('user.logged', this.userHasLoggedOut);
    },

    methods: {
        setBusy(busy) {
            this.busy = busy;
        },

        userHasLoggedIn(user) {
            this.user = user;
        },

        userHasLoggedOut(user) {
            this.user = null;
        }
    }
});

router.start(App, '#app');
