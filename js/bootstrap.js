import Vue from 'vue';
import $ from 'jquery';
import _ from 'underscore';
import Resource from 'vue-resource';

import 'jquery.panzoom';
import 'jquery-ui/draggable';
import 'jquery-ui/droppable';

import './components';
import './util/helpers';
import Form from './forms/Form';

Vue.use(Resource);
Vue.config.debug = true;

/**
 * Global variables.
 */
window._ = _;
window.Vue = Vue;
window.Form = Form;
window.http = Vue.http;
window.jQuery = window.$ = $;

require('bootstrap');
require('./storage');
require('./util/jquery.jcarousellite');
require('./util/jquery.ui.touch-punch');
