// Variables for toggling the camera and location
let isCameraOn = false;
let isLocationOn = false;
let locationWatchId = null;
let mediaStream = null; // To track the media stream for stopping it

// Initialize the barcode scanner without starting the camera
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
            alert("Failed to initialize scanner.");
            return;
        }
    });
}

// Start the barcode scanner when user clicks the button
function startBarcodeScanner() {
    if (!isCameraOn) {
        Quagga.start();
        isCameraOn = true;
        document.getElementById('scanner-container').style.display = 'block';

        // Handle detected barcodes
        Quagga.onDetected(function(result) {
            const barcode = result.codeResult.code;
            document.getElementById('barcode-result').textContent = `Ticket ID: ${barcode}`;
            Quagga.pause(); // Pause to prevent multiple detections

            // Send barcode data to server for validation
            fetch('/validate-ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticketID: barcode })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.valid ? 'Ticket is valid' : 'Ticket is invalid');
                Quagga.start(); // Resume scanning
            })
            .catch(error => {
                console.error('Error:', error);
                Quagga.start(); // Resume scanning even on error
            });
        });
    }
}

// Stop the barcode scanner and turn off the camera
function stopBarcodeScanner() {
    if (isCameraOn) {
        Quagga.stop();
        document.getElementById('scanner-container').style.display = 'none';
        isCameraOn = false;

        // Stop the camera stream
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
    }
}

// Button event listeners for camera control
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

// Remove auto-start of the camera
// Initialize QuaggaJS without starting the camera
initializeBarcodeScanner();

// Optional: Handle manual camera permissions with a video element
function requestCameraPermissions() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            mediaStream = stream; // Save the media stream
            const videoElement = document.querySelector('video');
            videoElement.srcObject = stream;
        })
        .catch(function(error) {
            console.error('Error accessing the camera: ', error);
            alert('Error accessing the camera: ' + error.message);
        });
}


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
 
