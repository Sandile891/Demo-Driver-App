const CACHE_NAME = 'putco-bus-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/CSS Bus.css',
  '/JS bus.js',
  '/ic.png'
];

// Install event: Cache files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve cached files when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Background Sync
self.addEventListener('sync', function(event) {
  if (event.tag === 'syncBusUpdates') {
    event.waitUntil(doBusUpdates());
  }
});

// Periodic Sync
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'syncBusUpdates') {
    event.waitUntil(doBusUpdates());
  }
});

// Push Notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'badge.png'
  };
  event.waitUntil(
    self.registration.showNotification('Bus App Notification', options)
  );
});
