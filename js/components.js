import Vue from 'vue';
import './components/navbar';

Vue.component('errors', {
    props: ['errors'],
    template: require('./templates/errors.html'),
});

Vue.component('success', {
    props: ['successful', 'message'],
    template: require('./templates/success.html'),
});
