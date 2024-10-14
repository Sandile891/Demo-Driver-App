// Variables for toggling the camera and location
let isCameraOn = false;
let isLocationOn = false;
let locationWatchId = null;

// Initialize the barcode scanner
function initializeBarcodeScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'), // Camera feed container
            constraints: {
                facingMode: "environment" // Rear camera
            }
        },
        decoder: {
            readers: ["code_128_reader"] // Barcode type (CODE128)
        }
    }, function(err) {
        if (err) {
            console.error("Error initializing QuaggaJS:", err);
            alert("Failed to start camera. Please check camera permissions.");
            return;
        }
    });
}

// Start the barcode scanner
function startBarcodeScanner() {
    if (!isCameraOn) {
        Quagga.start();
        isCameraOn = true;
        document.getElementById('scanner-container').style.display = 'block';
    }
}

// Stop the barcode scanner
function stopBarcodeScanner() {
    if (isCameraOn) {
        Quagga.stop();
        isCameraOn = false;
        document.getElementById('scanner-container').style.display = 'none';
    }
}

// Toggle the camera on and off
function toggleCamera() {
    if (isCameraOn) {
        stopBarcodeScanner(); // Disable camera
    } else {
        startBarcodeScanner(); // Enable camera
    }
}

// Call this function once to initialize QuaggaJS
initializeBarcodeScanner();

// Example of how to use the toggle function with a button
document.getElementById('toggle-camera-btn').addEventListener('click', toggleCamera);


    // Handle detected barcode
    Quagga.onDetected(function(result) {
        const barcode = result.codeResult.code;
        document.getElementById('barcode-result').textContent = `Ticket ID: ${barcode}`;

        // Send barcode data to server (mock example)
        fetch('/validate-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ticketID: barcode })
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                alert('Ticket is valid');
            } else {
                alert('Ticket is invalid');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

// Stop the barcode scanner
function stopBarcodeScanner() {
    if (isCameraOn) {
        Quagga.stop();
        document.getElementById('scanner-container').style.display = 'none';
        isCameraOn = false;
    }
}

// Enable location tracking
function enableLocation() {
    if (navigator.geolocation) {
        locationWatchId = navigator.geolocation.watchPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            document.getElementById('location-status').textContent = `Location enabled: Lat ${latitude}, Lng ${longitude}`;

            // Send location to server (mock example)
            fetch('/update-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat: latitude, lng: longitude })
            });

        }, () => {
            alert('Unable to access location.');
        });
        isLocationOn = true;
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Disable location tracking
function disableLocation() {
    if (isLocationOn && locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        document.getElementById('location-status').textContent = 'Location disabled';
        isLocationOn = false;
    }
}

// Button Event Listeners
document.getElementById('camera-btn').addEventListener('click', () => {
    startBarcodeScanner();
    document.getElementById('camera-btn').style.display = 'none';
    document.getElementById('stop-camera-btn').style.display = 'inline-block';
});

document.getElementById('stop-camera-btn').addEventListener('click', () => {
    stopBarcodeScanner();
    document.getElementById('stop-camera-btn').style.display = 'none';
    document.getElementById('camera-btn').style.display = 'inline-block';
});

document.getElementById('location-on-btn').addEventListener('click', () => {
    enableLocation();
    document.getElementById('location-on-btn').style.display = 'none';
    document.getElementById('location-off-btn').style.display = 'inline-block';
});

document.getElementById('location-off-btn').addEventListener('click', () => {
    disableLocation();
    document.getElementById('location-off-btn').style.display = 'none';
    document.getElementById('location-on-btn').style.display = 'inline-block';
});

if (document.querySelector('link[rel="manifest"]')) {
    console.log("Manifest link found.");
} else {
    console.log("Manifest link NOT found.");
}

      
      navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    // Success - camera started
    const videoElement = document.querySelector('video');
    videoElement.srcObject = stream;
  })
  .catch(function(error) {
    console.log('Error accessing the camera: ', error);
    // Handle different error cases
    if (error.name === 'NotReadableError') {
      alert('Camera is already in use by another application.');
    } else if (error.name === 'NotAllowedError') {
      alert('Camera access is not allowed. Please enable camera permissions.');
    } else {
      alert('Error accessing the camera: ' + error.message);
    }
  });

  const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });

/////

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
          'index.html',
          'manifest.json',
          'drivercss.css',
          'driverjs.js',
          'logo.png',
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

  /////

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
  }

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});
 
