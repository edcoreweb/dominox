export default function (callback) {
    if (!(Config.serviceWorker && 'serviceWorker' in navigator)) {
        return false;
    }

    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            callback(registration);

            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
}
