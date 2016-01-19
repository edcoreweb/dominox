import Auth from './Auth';
import VueRouter from 'vue-router';

let router = null;

if (!router) {
    router = new VueRouter();
}

/**
 * Define route mappings.
 */
router.map({
    '/home': {
        component: require('./components/home'),
        auth: true,
    },
    '/login': {
        component: require('./components/splash-screen'),
        guest: true,
    },
    '/game': {
        component: require('./components/game/main'),
        auth: true,
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
    let before = () => {
        // Redirect guest users to the login page.
        if (transition.to.auth && Auth.guest()) {
            return router.go('/login');
        }

        // Redirect authenticated user.
        if (transition.to.guest && Auth.check()) {
            return router.go('/home');
        }

        router.app.setBusy(false);
        transition.next();
    }

    // Attempt to authenticate the user
    // by the saved api token from local storage.
    Auth.retriveUserByToken()
        .then(() => before())
        .catch(() => before());
});

module.exports = router;
