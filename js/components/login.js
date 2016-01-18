import User from './../User';
import Auth from './../Auth';
import popup from './../util/popup';

module.exports = {
    template: require('./../templates/login.html'),

    data() {
        return {
        }
    },

    methods: {
        /**
         * Login by provider.
         *
         * @param  {String} provider
         */
        login(provider) {
            http.post('oauth/url', {provider: provider})
                .then((response) => this.openPopup(response.data, provider))
                .catch((err) => alert('Error!'));
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

            http.post('oauth/user', {code: code, provider: provider})
                .then((response) => {
                    Auth.setUser(new User(response.data));
                    Auth.saveToken();

                    this.$router.go('/home');
                })
                .catch((err) => {
                    alert('Error!');
                })
                .then(() => {
                    localStorage.removeItem('_code');
                });
        },
    }
};
