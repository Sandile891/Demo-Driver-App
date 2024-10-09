// JavaScript for interactive features
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('This feature is coming soon!');
        });
    });
});

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/',
          '/Bus app.html',
          '/manifest.json',
          '/CSS Bus.css',
          '/JS bus.js',
          '/icon.png',
        ]);
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
  
  ///

  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  
  // Display your custom install button or message here
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for user response
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null; // Reset
    });
  });
});

//////

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/PutcoBusApp/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
}

// Register background sync
navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('syncBusUpdates');
});

// Periodic Sync
navigator.permissions.query({ name: 'periodic-background-sync' }).then((result) => {
  if (result.state === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.periodicSync.register({
        tag: 'syncBusUpdates', 
        minInterval: 24 * 60 * 60 * 1000  // Once a day
      });
    });
  }
});

navigator.serviceWorker.ready.then(function(registration) {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: '<YOUR_PUBLIC_KEY>'
  }).then(function(subscription) {
    console.log('User is subscribed:', subscription);
  }).catch(function(err) {
    console.log('Failed to subscribe user: ', err);
  });
});

------

    const CACHE_NAME = 'cool-cache';

// Add whichever assets you want to pre-cache here:
const PRECACHE_ASSETS = [
    '/assets/',
    '/src/'
]

// Listener for the install event - pre-caches our assets list on service worker install.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(PRECACHE_ASSETS);
    })());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
