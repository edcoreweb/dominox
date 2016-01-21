import './bootstrap';
import router from './router';

let App = Vue.extend({
    data() {
        return {
            user: null,
            busy: true
        };
    },

    ready() {
        this.$on('user.login', this.userHasLoggedIn);
        this.$on('user.logged', this.userHasLoggedOut);

        window.addEventListener('online', () => this.online());
    },

    methods: {
        setBusy(busy) {
            this.busy = busy;
        },

        userHasLoggedIn(user) {
            this.user = user;
        },

        userHasLoggedOut() {
            this.user = null;
        },

        online() {
            if (!socket.isOpen()) {
                socket.connect();
            }
        }
    }
});

router.start(App, '#app');
