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

//

self.addEventListener('push', function(event) {
  var options = {
    body: event.data.text(),
    icon: '/images/icon.png',
    badge: '/images/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification('Putco Bus App', options)
  );
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }, function(err) {
        console.log('Service Worker registration failed:', err);
      });
  });
}

  
// Check if the service worker and Push API are supported
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/service-worker.js')  // Register your service worker
  .then(function(swRegistration) {
    console.log('Service Worker Registered', swRegistration);

    // Request permission to send notifications
    return Notification.requestPermission();
  })
  .then(function(permission) {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Subscribe the user to the push service
      return navigator.serviceWorker.ready.then(function(swRegistration) {
        return swRegistration.pushManager.subscribe({
          userVisibleOnly: true,  // Push notifications are always user-visible
          applicationServerKey: urlB64ToUint8Array('<Your Public VAPID Key>')  // VAPID Key here
        });
      });
    } else {
      console.log('Notification permission denied.');
    }
  })
  .then(function(subscription) {
    if (subscription) {
      console.log('User is subscribed:', subscription);

      // Send the subscription object to your server to store it
      fetch('/save-subscription', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
    }
  })
  .catch(function(error) {
    console.error('Error during Service Worker registration or Push subscription:', error);
  });
}

// Helper function to convert VAPID key (base64) to a Uint8Array
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
