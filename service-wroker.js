// service-worker.js

const CACHE_NAME = 'putco-bus-cache-v1';
const urlsToCache = [
  '/',
  '/Putco-Bus-App/',
  '/Putco-Bus-App/index.html',  // Replace with your actual HTML file paths
  '/Putco-Bus-App/Buying trips.html', 
  '/Putco-Bus-App/Live tracking.html',
  '/Putco-Bus-App/ic.png',  // Add paths to your images and other assets
  '/Putco-Bus-App/your-image-192.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Update the service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
