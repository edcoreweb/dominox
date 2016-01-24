import Events from 'minivents';

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

            this.events = new Events();
            this.address = address;
            this.port = port;

            this.connect();
        }

        return instance;
    }

    connect() {
        this.ws = new WebSocket('ws://' + this.address + ':' + this.port);

        this.ws.onerror = (e) => this.onerror(e);
        this.ws.onmessage = (e) => this.onmessage(e);
    }

    onerror(e) {
        console.log(e);
        this.events.emit('error', e);
    }

    onmessage(e) {
        let dataJSON;

        try {
            dataJSON = JSON.parse(e.data);
        } catch (e) {
            console.log(e);
            return;
        }

        let response = {
            e: e,
            data: dataJSON.data,
            status: dataJSON.status || 200
        };

        this.events.emit('message', response);
        this.events.emit(dataJSON.event, response);
    }

    /**
     * Listen to event.
     *
     * @param  {String}   event
     * @param  {Function} callback
     */
    on(event, callback, clear = true) {
        if (clear) {
            this.events.off(event);
        }

        this.events.on(event, callback);
    }

    /**
     * Send event with data to server.
     *
     * @param  {String} event
     * @param  {mixed} data
     * @param  {Function} callback
     * @retun  {Promise}
     */
    send(event, data) {
        return new Promise((resolve, reject) => {
            let callback = (response) => {
                this.events.off(event, callback);

                if (response.status < 400) {
                    resolve(response);
                } else {
                    reject(response);
                }
            };

            this.on(event, callback);

            this.sendData({event: event, data: data});
        });
    }

    /**
     * Send raw data to the server.
     *
     * @param  {mixed} data
     */
    sendData(data) {
        data = JSON.stringify(data);

        this.waitForConnection(() => {
            this.ws.send(data);
        }, 100);
    }

    waitForConnection(callback, interval) {
        if (this.isOpen()) {
            callback();
        } else {
            setTimeout(() => {
                this.waitForConnection(callback, interval);
            }, interval);
        }
    }

    isOpen() {
        return this.ws.readyState == WebSocket.OPEN;
    }
}

module.exports = instance ? new Socket() : Socket;
