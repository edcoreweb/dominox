import VueRouter from 'vue-router';
import beforeEach from './util/beforeEach';

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
        auth: true
    },

    // Authenitication.
    '/login': {
        component: require('./components/splash-screen'),
        guest: true
    },
    '/logout': {
        component: require('./components/logout'),
        auth: true
    },

    // Multiplayer game.
    '/game': {
        component: require('./components/game/main'),
        auth: true
    },
    '/join/:hash': {
        component: require('./components/game/join'),
        name: 'game.join',
        auth: true
    },
    '/browse': {
        component: require('./components/game/browse'),
        name: 'game.browse',
        auth: true
    },

    // Singleplayer game.
    '/singleplayer': {
        component: require('./components/game/single-player')
    }
});

// Redirect any not-found route to home.
router.redirect({'*': '/home'});

// Route middleware.
router.beforeEach((transition) => beforeEach(router, transition));

module.exports = router;
