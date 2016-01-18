import Vue from 'vue';
import $ from 'jquery';
import Auth from './Auth';
import Resource from 'vue-resource';
import './components';

Vue.use(Resource);
Vue.http.options.root = Config.api;

/**
 * Global variables.
 */
window.Vue = Vue;
window.http = Vue.http;
window.jQuery = window.$ = $;

require('bootstrap');

/**
 * Add HTTP request/response interceptors.
 */
Vue.http.interceptors.push({
    request: (request) => {
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
