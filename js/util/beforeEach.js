import Auth from './../Auth';

let before = (router, transition) => {
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
};

module.exports = (router, transition) => {
    if (Auth.check()) {
        return before(router, transition);
    }

    // Attempt to authenticate the user
    // by the saved api token from local storage.
    Auth.retriveUserByToken()
        .then(() => {})
        .catch((err) => { console.log(err); })
        .then(() => {
            before(router, transition);

            router.app.$dispatch('user.login', Auth.user());
        });
};
