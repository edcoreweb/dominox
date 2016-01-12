import Auth from './Auth';
import VueRouter from 'vue-router';

let router = new VueRouter();

/**
 * Define route mappings.
 */
router.map({
    '/home': {
        component: require('./components/home'),
        auth: true,
    },
    '/login': {
        component: require('./components/login'),
        guest: true,
    },
});

/**
 * Redirect any not-found route to home.
 */
router.redirect({'*': '/home'});

/**
 * Route middleware.
 */
router.beforeEach(function(transition) {
    if (transition.to.auth && Auth.guest()) {
        return router.go('/login');
    }

    if (transition.to.guest && Auth.check()) {
        return router.go('/home');
    }

    transition.next();
});

module.exports = router;
