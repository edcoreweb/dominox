class User {
    /**
     * Create a new user instance.
     *
     * @param {Object} attributes
     */
    constructor(attributes) {
        this.id = attributes.id;
        this.name = attributes.name;
        this.email = attributes.email;
        this.api_token = attributes.api_token;
        this.subscription = attributes.subscription;
    }

    /**
     * Get the api token.
     *
     * @return {String}
     */
    apiToken() {
        return this.api_token;
    }
}

module.exports = User;
