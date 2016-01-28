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

            this.port = port;
            this.address = address;
            this.events = new Events();

            this.connect();
        }

        return instance;
    }

    /**
     * Connect to socket.
     */
    connect() {
        let protocol = window.location.protocol == 'https:' ? 'wss' : 'ws';

        this.ws = new WebSocket(protocol+'://' + this.address + ':' + this.port);

        this.ws.onerror = (e) => this._onerror(e);
        this.ws.onmessage = (e) => this._onmessage(e);
    }

    /**
     * Handle socket error.
     *
     * @param  {Event} e
     */
    _onerror(e) {
        console.log(e);
        this.events.emit('error', e);
    }

    /**
     * Handle socket message.
     *
     * @param  {Event} e
     */
    _onmessage(e) {
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
     * @param  {Boolean}  clear
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
     * @param  {mixed}  data
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

        this._waitForConnection(() => {
            this.ws.send(data);
        }, 100);
    }

    /**
     * Wait for connection to be open.
     *
     * @param  {Function} callback
     * @param  {Number}   interval
     */
    _waitForConnection(callback, interval) {
        if (this.isOpen()) {
            callback();
        } else {
            setTimeout(() => {
                this._waitForConnection(callback, interval);
            }, interval);
        }
    }

    /**
     * Determine if the socket is open.
     *
     * @return {Boolean}
     */
    isOpen() {
        return this.ws.readyState == WebSocket.OPEN;
    }
}

module.exports = instance ? new Socket() : Socket;
