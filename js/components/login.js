import Auth from './../Auth';

module.exports = {
    template: '<p>Login page</p>',

    ready() {
        let credentials = {
            username: 'eusebiu',
            password: 'test1234',
        };

        Auth.attempt(credentials);
    }
};
