import './bootstrap';
import router from './router';

let App = Vue.extend({
    data() {
        return {
            busy: true,
        };
    },

    methods: {
        setBusy(busy) {
            this.busy = busy;
        }
    }
});

router.start(App, '#app');
