var CACHE_NAME = 'dominox.app.cache';

var requests = [
    '/dominox/',
    '/dominox/dist/js/app.js',
    '/dominox/dist/css/app.css',
    '/dominox/dist/img/logo.png',
    'https://fonts.gstatic.com/s/lato/v11/1YwB1sO8YE1Lyjf12WNiUA.woff2',
    'https://fonts.gstatic.com/s/lato/v11/EsvMC5un3kjyUhB9ZEPPwg.woff2',
    'https://fonts.googleapis.com/css?family=Lato:100,300,400,700'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cached requests added!');
                return cache.addAll(requests);
            })
            .catch(function(err) {
                console.log(err);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }

                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
