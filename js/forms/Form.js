import FormErrors from './FormErrors';

class Form {
    /**
     * Create a new form instance.
     *
     * @param  {Object} data
     */
    constructor(data) {
        $.extend(this, data);

        this.busy = false;
        this.successful = false;
        this.errors = new FormErrors();
        this.ignore = ['busy', 'ignore', 'errors', 'successful'];
    }

    /**
     * Get form data.
     *
     * @return {Object}
     */
    getData() {
        let data = {};

        for (let key in this) {
            if (this.ignore.indexOf(key) < 0) {
                data[key] = this[key];
            }
        }

        return data;
    }

    /**
     * Send the form to the server.
     *
     * @param  {String} method
     * @param  {String} uri
     * @return {Promise}
     */
    send(method, uri) {
        return new Promise((resolve, reject) => {
            this.startProcessing();

            http[method](uri, this)
                .then((response) => {
                    this.finishProcessing();

                    resolve(response);
                })
                .catch((response) => {
                    this.busy = false;
                    this.errors.set(response.data);

                    reject(response);
                });
        });
    }

    /**
     * Send the form to the server with PATCH method.
     *
     * @param  {String} uri
     * @return {Promise}
     */
    patch(uri) {
        return this.send('patch', uri);
    }

    /**
     * Start processing the form.
     */
    startProcessing() {
        this.errors.clear();
        this.busy = true;
        this.successful = false;
    }

    /**
     * Finish processing the form.
     */
    finishProcessing() {
        this.busy = false;
        this.successful = true;
    }

    /**
     * Clear the form.
     */
    clear() {
        this.errors.clear();
        this.successful = false;
    }
}

module.exports = Form;
