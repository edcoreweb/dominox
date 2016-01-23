import Auth from './../Auth';

module.exports = {
    created() {
        Auth.logout();

        this.$dispatch('user.logout');

        this.$router.go({name: 'auth.login'});
    }
};
