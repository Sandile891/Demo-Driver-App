const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/CSS Bus.css', // Add your CSS files here
  '/JS bus.js',  // Add your JavaScript files here
  // Add other assets like images, etc.
];

self.addEventListener('install', function(event) {
  // Perform the install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Putco-Bus-App/',  // Root
  '/Putco-Bus-App/index.html',
  '/Putco-Bus-App/manifest.json',
  '/Putco-Bus-App/CSS%20Bus.css', // Ensure the URL encoding is correct for spaces
  '/Putco-Bus-App/JS%20bus.js',
  // Add other assets like images
];
