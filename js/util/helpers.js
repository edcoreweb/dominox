import Vue from 'vue';

/**
 * Add vue transition.
 */
Vue.transition('fade', {
    enter(el, done) {
        $(el).css('opacity', 0)
             .animate({opacity: 1}, 200, done);
    },
    enterCancelled(el) {
        $(el).stop();
    },
    leave(el, done) {
        $(el).animate({opacity: 0}, 200, done);
    },
    leaveCancelled(el) {
        $(el).stop();
    }
});
