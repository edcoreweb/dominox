let instance = null;

class Socket {
    /**
     * Create a new web socket instance.
     *
     * @param {String} address
     * @param {Number} {port}
     */
    constructor(address, port) {
        if (!instance) {
            instance = this;
        }

        this.ws = new WebSocket(`ws://${address}:${port}`);

        this.ws.onerror = (e) => {
            console.log(e);
        };

        return instance;
    }

    /**
     * Add web socket onmessage listener.
     *
     * @param  {Function} callback
     */
    message(callback) {
        this.ws.onmessage = (e) => {
            try {
                e.dataJSON = JSON.parse(e.data);
            } catch (e) {
                e.dataJSON = null;
            }

            callback(e);
        };
    }

    /**
     * Send event with data to server.
     *
     * @param  {String} event
     * @param  {mixed} data
     */
    send(event, data) {
        this.sendData({e: event, d: data});
    }

    /**
     * Send raw data to the server.
     *
     * @param  {mixed} data
     */
    sendData(data) {
        data = JSON.stringify(data);

        this.ws.send(data);
    }
}

module.exports = instance ? new Socket() : Socket;
