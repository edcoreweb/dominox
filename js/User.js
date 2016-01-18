class User {
    /**
     * Create a new user instance.
     *
     * @param {Object} attributes
     */
    constructor(attributes) {
        this.name = attributes.name;
        this.apiToken = attributes.apiToken;
    }

    /**
     * Get the api token.
     *
     * @return {String}
     */
    apiToken() {
        return this.apiToken;
    }
}

module.exports = User;
