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

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    badge: '/path-to-badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Listen for Push Events
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);

  // Extract the payload data from the event
  const data = event.data ? event.data.json() : { title: 'Default title', body: 'Default message' };

  // Options for the notification
  const options = {
    body: data.body,  // The message body
    icon: '/icons/icon-512.png',  // Your app icon
    badge: '/icons/icon-badge.png',  // A smaller icon
    vibrate: [100, 50, 100],  // Vibration pattern
    tag: 'push-notification',  // Notification tag
  };

  // Display the notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click event:', event);

  event.notification.close();  // Close the notification

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');  // Redirect to your app
    })
  );
});
