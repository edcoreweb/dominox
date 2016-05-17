import './bootstrap';
import Auth from './Auth';
import router from './router';
import Socket from './Socket';
import sw from './serviceWorker';

window.onload = () => {
    window.socket = new Socket(Config.ws.address, Config.ws.port);

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
            this.$on('user.update', this.userHasBeenUpdated);

            window.addEventListener('online', () => this.online());

            if (this.user) {
                this.initServiceWorker();
            }
        },

        methods: {
            initServiceWorker() {
                sw((registration) => {
                    if (!this.user.subscription) {
                        this.subscribe(registration);
                    }
                });
            },

            subscribe(registration) {
                registration.pushManager.subscribe({userVisibleOnly: true})
                    .then((subscription) => {
                        const sub = subscription.endpoint.substr(subscription.endpoint.lastIndexOf('/') + 1)
                        socket.send('user.subscribe', {subscription: sub});
                    });
            },

            setBusy(busy) {
                this.busy = busy;
            },

            userHasLoggedIn(user) {
                this.user = user;

                this.initServiceWorker();
            },

            userHasLoggedOut() {
                this.user = null;
            },

            userHasBeenUpdated(user) {
                this.user = user;
                Auth.setUser(user);
            },

            online() {
                if (!socket.isOpen()) {
                    socket.connect();
                }
            }
        }
    });

    router.start(App, '#app');
}
