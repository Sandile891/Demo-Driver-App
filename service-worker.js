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
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Code for syncing data when back online
}

self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'periodic-sync-tag') {
    event.waitUntil(fetchLatestData());
  }
});

function fetchLatestData() {
  // Code to fetch new data periodically
}
self.addEventListener('push', function(event) {
  let data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'You have a new message!',
    icon: 'logo.png',
    badge: 'badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Push Notification', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://sandile891.github.io/DemoBusApp/')
  );
});
