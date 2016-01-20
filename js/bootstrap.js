import Vue from 'vue';
import $ from 'jquery';
import _ from 'underscore';
import Resource from 'vue-resource';

import './components';
import './util/helpers';
import Auth from './Auth';
import Form from './forms/Form';

Vue.use(Resource);
Vue.config.debug = true;
Vue.http.options.root = Config.api;

/**
 * Global variables.
 */
window._ = _;
window.Vue = Vue;
window.Form = Form;
window.http = Vue.http;
window.jQuery = window.$ = $;

require('bootstrap');

/**
 * Add HTTP request/response interceptors.
 */
Vue.http.interceptors.push({
    request: (request) => {
        if (request.data instanceof Form) {
            request.data = request.data.getData();
        }

        // Add api_token param to every api request.
        if (Auth.check()) {
            request.params.api_token = Auth.apiToken();
        }

        return request;
    },
    response: (response) => {
        return response;
    }
});

if (Config.serviceWorker && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
}
