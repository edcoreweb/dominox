import Vue from 'vue';
import $ from 'jquery';
import Resource from 'vue-resource';

import './components';

Vue.use(Resource);

window.Vue = Vue;
window.http = Vue.http;
Vue.http.options.root = Config.api;
window.$ = window.jQuery = $;

require('bootstrap');

Vue.http.interceptors.push({
    request: (request) => {
        if (Auth.check()) {
            request.params.api_token = Auth.apiToken();
        }

        return request;
    },
    response: (response) => {
        return response;
    }
});
