// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

if (firebase) {
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
}

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
    .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

self.addEventListener('notificationclick', event => {
  const url = event.notification.data.url;
  event.notification.close();
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});


if (firebase) {
  const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/default_image.jpg',
      data: {
        url: null
      }
    };

    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
}