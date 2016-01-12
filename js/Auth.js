let instance = null;

class Auth {
    /**
     * Create a new auth instance.
     */
    constructor() {
        if (!instance) {
            instance = this;
        }

        this._user = null;

        return instance;
    }

    /**
     * Get the currently authenticated user.
     *
     * @return {User|null}
     */
    user() {
        return this._user;
    }

    /**
     * Get the currently authenticated user api token.
     *
     * @return {String|null}
     */
    apiToken() {
        return this.user().apiToken();
    }

    /**
     * Set the current user.
     *
     * @param  {User} user
     * @return {void}
     */
    setUser(user) {
        this._user = user;
    }

    /**
     * Determine if the current user is authenticated.
     *
     * @return {Boolean}
     */
    check() {
        return this.user() !== null;
    }

    /**
     * Determine if the current user is a guest.
     *
     * @return {Boolean}
     */
    guest() {
        return !this.check();
    }

    /**
     * Attempt to authenticate a user using the given credentials.
     *
     * @param  {Object}  credentials
     * @param  {Boolean} remember
     * @param  {Boolean} login
     * @return {Promise}
     */
    attempt(credentials, remember = false, login = true) {
        return new Promise((resolve, reject) => {
            http.post('/auth/login', credentials)
                .then((response) => {
                    console.log(response);
                    resolve(response);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}

module.exports = new Auth();
