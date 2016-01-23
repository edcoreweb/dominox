import User from './../User';
import Auth from './../Auth';
import swal from 'sweetalert';
import popup from './../util/popup';

module.exports = {
    template: require('./../templates/login-modal.html'),

    data() {
        return {
            busy: false
        };
    },

    methods: {
        /**
         * Login by provider.
         *
         * @param  {String} provider
         */
        login(provider) {
            this.busy = true;

            socket.send('oauth.url', {provider: provider})
                .then((response) => {
                    this.openPopup(response.data, provider);
                })
                .catch((er) => {
                    console.log(er);
                    this.busy = false;
                    swal('Opps!', 'Something went wrong. Please try again.', 'warning');
                });
        },

        /**
         * Open popup window to authorize app.
         *
         * @param  {String} url
         * @param  {String} provider
         */
        openPopup(url, provider) {
            let loginWindow = popup(1100, 800, url);

            let timer = setInterval(() => {
                if (loginWindow.closed) {
                    clearInterval(timer);

                    this.retriveUser(provider);
                }
            }, 1000);
        },

        /**
         * Retrive user with the oauth code.
         *
         * @param  {String} provider
         */
        retriveUser(provider) {
            let code = localStorage.getItem('_code');

            if (!code) {
                this.busy = false;
                return;
            }

            socket.send('oauth.user', {code: code, provider: provider})
                .then((response) => {
                    Auth.setUser(new User(response.data));
                    Auth.saveToken();

                    $('#login-modal').modal('hide');

                    this.$dispatch('user.login', Auth.user());

                    this.$router.go({name: 'home'});
                })
                .catch((response) => {
                    swal('Opps!', response.status == 422 ? response.data : 'Something went wrong. Please try again.', 'warning');
                })
                .then(() => {
                    localStorage.removeItem('_code');
                })
                .then(() => this.busy = false);
        }
    }
};
