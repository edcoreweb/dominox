(function(){
    var CACHE_NAME = 'dominox.cache';

    var requests = [
        '',
        '/dist/js/app.js',
        '/dist/css/app.css',
        '/dist/img/logo.png',
        '/dist/img/bg.jpg',
        '/dist/img/bones.jpg',
        '/dist/img/bones2.jpg'
    ];

    var external = [
        'https://fonts.gstatic.com/s/lato/v11/1YwB1sO8YE1Lyjf12WNiUA.woff2',
        'https://fonts.gstatic.com/s/lato/v11/EsvMC5un3kjyUhB9ZEPPwg.woff2',
        'https://fonts.googleapis.com/css?family=Lato:100,300,400,700'
    ];

    for (let i = 0; i < requests.length; i++) {
        requests = window.location.pathname + requests[i];
    }

    requests = requests.concat(external);

    self.addEventListener('install', function(e) {
        e.waitUntil(
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

    self.addEventListener('fetch', function(e) {
        e.respondWith(
            caches.match(e.request)
                .then(function(response) {
                    if (response) {
                        return response;
                    }

                    var fetchRequest = e.request.clone();

                    return fetch(fetchRequest).then(
                        function(response) {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            var responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(e.request, responseToCache);
                                });

                            return response;
                        }
                    );
                })
        );
    });
})();
