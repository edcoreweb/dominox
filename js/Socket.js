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

            this.ws = new WebSocket('ws://' + address + ':' + port);

            this.ws.onerror = (e) => {
                console.log(e);
                this.events.emit('error', e);
            };

            this.ws.onmessage = (e) => {
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
            };
        }

        return instance;
    }

    /**
     * Listen to event.
     *
     * @param  {String}   event
     * @param  {Function} callback
     */
    on(event, callback) {
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

                if (response.status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            };

            this.on(event, callback);

            this.sendData({e: event, d: data});
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
        if (this.ws.readyState === WebSocket.OPEN) {
            callback();
        } else {
            setTimeout(() => {
                this.waitForConnection(callback, interval);
            }, interval);
        }
    }
}

module.exports = instance ? new Socket() : Socket;
