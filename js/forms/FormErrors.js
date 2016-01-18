class FormErrors {
    /**
     * Create a new error bag instance.
     */
    constructor() {
        this.errors = {};
    }

    /**
     * Determine if the collection has any errors.
     *
     * @return {Boolean}
     */
    hasErrors() {
        return !_.isEmpty(this.errors);
    }

    /**
     * Determine if the collection has errors for a given field.
     *
     * @param  {String} field
     * @return {Boolean}
     */
    has(field) {
        return _.indexOf(_.keys(this.errors), field) > -1;
    }

    /**
     * Get all of the errors for the collection.
     *
     * @return {Object}
     */
    all() {
        return this.errors;
    }

    /**
     * Get all of the errors for the collection in a flat array.
     *
     * @return {Array}
     */
    flatten() {
        return _.flatten(_.toArray(this.errors));
    }

    /**
     * Get the first error message for a given field.
     */
    get(field) {
        if (this.has(field)) {
            return this.errors[field][0];
        }
    }

    /**
     * Set the raw errors for the collection.
     *
     * @param {Object}
     */
    set(errors) {
        if (typeof errors === 'object') {
            this.errors = errors;
        } else {
            this.errors = {'field': ['Something went wrong. Please try again.']};
        }
    }

    /**
     * Clear all of the errors from the collection.
     */
    clear() {
        this.errors = {};
    }
}

module.exports = FormErrors;
