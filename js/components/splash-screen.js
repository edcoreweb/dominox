module.exports = {
    template: require('./../templates/splash-screen.html'),

    data() {
        return {
            online: window.navigator.onLine
        };
    },

    components: {
        'login-modal': require('./login-modal')
    },

    ready() {
        window.addEventListener('online', () => this.online = true);
        window.addEventListener('offline', () => this.online = false);
    }
};
