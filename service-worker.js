const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'drivercss.css', // Add your CSS files here
  'driverjs.js',// Add your JavaScript files here
  'logo.png',
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
////////////////////////////
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-driver-data') {
    event.waitUntil(syncDriverData());
  }
});

function syncDriverData() {
  // Logic to sync data when connectivity is restored
  return fetch('/sync-driver-location', {
    method: 'POST',
    body: JSON.stringify({ /* Your data here */ }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
}
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-driver-location-periodic') {
    event.waitUntil(syncDriverLocationPeriodically());
  }
});

function syncDriverLocationPeriodically() {
  // Periodic location sync logic
  return fetch('/sync-location-periodic', {
    method: 'POST',
    body: JSON.stringify({ /* Your periodic location data here */ }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
}
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png', // Add your icon path
    badge: '/icons/notification-badge.png' // Add your badge path
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
const CACHE_NAME = 'driver-app-cache';
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'drivercss.css',
  'driverjs.js',
  'logo.png',
  // Add more assets to cache here
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


