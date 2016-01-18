import FormErrors from './FormErrors';

class Form {
    /**
     * Create a new form instance.
     *
     * @param  {Object} data
     */
    constructor(data) {
        this.data = data;
        this.busy = false;
        this.successful = false;
        this.errors = new FormErrors();
    }

    /**
     * Get form data.
     *
     * @return {Object}
     */
    getData() {
        return this.data;
    }

    /**
     * Send the form to the server.
     *
     * @param {String} method
     * @param {String} uri
     */
    send(method, uri) {
        return new Promise((resolve, reject) => {
            this.startProcessing();

            http[method](uri, this)
                .then((response) => {
                    this.finishProcessing();

                    resolve(response);
                })
                .catch((errors) => {
                    form.errors.set(errors);
                    form.busy = false;

                    reject(errors);
                });
        });
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
}

module.exports = Form;
