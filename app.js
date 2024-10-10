if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('Service worker registered', reg))
      .catch((err) => console.log('Service worker not registered', err));
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
          .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
              console.error('Service Worker registration failed:', error);
          });
  });
}
