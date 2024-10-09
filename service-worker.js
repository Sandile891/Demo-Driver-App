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
  '/',                    // Root
  '/index.html',           // Main HTML file
  '/manifest.json',        // Manifest file
  '/CSS%20Bus.css',        // CSS file (URL-encoded)
  '/JS%20bus.js',          // JavaScript file (URL-encoded)
  '/Buy%20trips.html',     // Another HTML file (URL-encoded)
  '/Check%20prices.html',
  '/Live%20tracking.html',
  '/Ss.png',               // Images
  '/contact%20us.html',
  '/ic.png',
  '/icc.png',
  '/icn.png',
  '/im128.png',
  '/screen.png',
  '/shot.png'
];

