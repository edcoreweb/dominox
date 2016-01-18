let instance = null;
const STORAGE_KEY = '_api_token';

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
            http.post('auth/login', credentials)
                .then((user) => {
                    this.setUser(new User(user));

                    if (remember) {
                        this.saveToken(user.api_token);
                    }

                    resolve(this.user());
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Retrive user by api token.
     *
     * @return {Promise|null}
     */
    retriveUserByToken() {
        return new Promise((resolve, reject) => {
            let token = this.getToken();

            if (token) {
                this.attempt({api_token: token}, true, true)
                    .then((user) => resolve(user))
                    .catch(() => {
                        this.forgetToken();
                        reject();
                    });
            } else {
                reject();
            }
        });
    }

    /**
     * Save token into local storage.
     *
     * @param  {String} token
     * @return {void}
     */
    saveToken(token) {
        localStorage.setItem(STORAGE_KEY, token);
    }

    /**
     * Get token from local storage.
     *
     * @return {String|null}
     */
    getToken() {
        return localStorage.getItem(STORAGE_KEY);
    }

    /**
     * Forget token from local storage.
     *
     * @return {void}
     */
    forgetToken() {
        localStorage.removeItem(STORAGE_KEY);
    }
}

module.exports = new Auth();
