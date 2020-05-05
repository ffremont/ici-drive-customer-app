importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

importScripts('/__/firebase/7.14.2/firebase-app.js');
importScripts('/__/firebase/7.14.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBhKGZb-0hVnWkRhImIaywwJ9eZIXRDzpI",
    authDomain: "app.ici-drive.fr",
    databaseURL: "https://ici-drive.firebaseio.com",
    projectId: "ici-drive",
    storageBucket: "ici-drive.appspot.com",
    messagingSenderId: "197845039865",
    appId: "1:197845039865:web:8c0b37d09dbff116248028",
    measurementId: "G-DWMZEW5DNP"
  });

const OFFLINE_PAGE = '/offline.html';
const FALLBACK_IMAGE_URL = '/default_image.jpg';

if(firebase){
    const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);

        // Customize notification here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
          body: 'Background Message body.',
          icon: '/default_image.jpg',
          data:{
              url: null
          }
        };
      
        return self.registration.showNotification(notificationTitle,
          notificationOptions);
      });
}

self.addEventListener('notificationclick', event => {
    const url = event.notification.data.url;
    event.notification.close();
    if(url){
        event.waitUntil(clients.openWindow(url));
    }
  });


if (workbox) {
    workbox.core.setCacheNameDetails({
        prefix: 'app',
        suffix: 'web',
        precache: 'install-time',
        runtime: 'run-time'
    });
    workbox.precaching.precacheAndRoute([
        '/favicon.ico',
        OFFLINE_PAGE,
        FALLBACK_IMAGE_URL
    ]);

    // par défaut
    workbox.routing.setDefaultHandler(
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.setCatchHandler(({
        event
    }) => {
        switch (event.request.destination) {
            case 'document':
                return caches.match(OFFLINE_PAGE);
                break;

            case 'image':
                return caches.match(FALLBACK_IMAGE_URL);
                break;

            default:
                // If we don't have a fallback, just return an error response.
                return Response.error();
        }
    });

    console.log(`Yay! Workbox is loaded 🎉`);

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}