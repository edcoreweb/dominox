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
     * @return {Object}
     */
    attempt(credentials, remember = false, login = true) {

    }
}

module.exports = new Auth();
