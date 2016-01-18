import Vue from 'vue';
import $ from 'jquery';
import _ from 'underscore';
import Resource from 'vue-resource';

import './components';
import Auth from './Auth';
import Form from './forms/Form';

Vue.use(Resource);
Vue.http.options.root = Config.api;
Vue.http.options.xhr = {withCredentials: true};

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
