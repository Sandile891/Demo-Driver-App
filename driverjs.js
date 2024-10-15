// Variables for toggling the camera, location, and WiFi tracking
let isCameraOn = false;
let isLocationOn = false;
let isWiFiOn = false;
let locationWatchId = null;
let scannedBarcodes = new Set(); // Store unique barcodes

// Start the barcode scanner using QuaggaJS
function startBarcodeScanner() {
    if (isCameraOn) return; // Prevent multiple camera instances

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'), // Camera feed container
            constraints: {
                facingMode: "environment" // Use rear camera
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
        Quagga.start();
        isCameraOn = true;
        document.getElementById('scanner-container').style.display = 'block';
    });

    // Handle detected barcodes
    Quagga.onDetected(function(result) {
        const barcode = result.codeResult.code;

        if (!scannedBarcodes.has(barcode)) { // Only process new barcodes
            scannedBarcodes.add(barcode);
            document.getElementById('barcode-result').textContent = `Scanned Ticket IDs: ${Array.from(scannedBarcodes).join(', ')}`;

            // Send barcode data to Firestore for validation and deletion
            validateAndDeleteBarcode(barcode);

            // Stop the scanner after 20 barcodes
            if (scannedBarcodes.size === 20) {
                stopBarcodeScanner();
            }
        }
    });
}

// Stop the barcode scanner
function stopBarcodeScanner() {
    if (isCameraOn) {
        Quagga.stop();
        document.getElementById('scanner-container').style.display = 'none';
        isCameraOn = false;
        scannedBarcodes.clear(); // Reset after stopping the camera
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

// Enable WiFi tracking
function enableWiFiTracking() {
    if (!navigator.onLine) {
        alert('WiFi not available. Please connect to a WiFi network.');
        return;
    }

    // Mock example for WiFi tracking
    const wifiSSID = 'Mock WiFi SSID'; // Replace with actual WiFi tracking logic
    document.getElementById('wifi-status').textContent = `Connected to WiFi: ${wifiSSID}`;
    isWiFiOn = true;

    // Send WiFi info to server
    fetch('/update-wifi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ssid: wifiSSID })
    });
}

// Disable WiFi tracking
function disableWiFiTracking() {
    document.getElementById('wifi-status').textContent = 'WiFi tracking disabled';
    isWiFiOn = false;
}

// Function to validate and delete barcode from Firestore
function validateAndDeleteBarcode(barcode) {
    // Firestore initialization
    const db = firebase.firestore();
    const barcodeRef = db.collection('tickets').doc(barcode);

    barcodeRef.get().then((doc) => {
        if (doc.exists) {
            // Barcode is valid, proceed to delete
            barcodeRef.delete().then(() => {
                alert('Ticket is valid and has been deleted from the server.');
            }).catch((error) => {
                console.error("Error deleting document: ", error);
                alert('Error deleting ticket from server.');
            });
        } else {
            alert('Ticket is invalid.');
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });
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

document.getElementById('wifi-on-btn').addEventListener('click', () => {
    enableWiFiTracking();
    document.getElementById('wifi-on-btn').style.display = 'none';
    document.getElementById('wifi-off-btn').style.display = 'inline-block';
});

document.getElementById('wifi-off-btn').addEventListener('click', () => {
    disableWiFiTracking();
    document.getElementById('wifi-off-btn').style.display = 'none';
    document.getElementById('wifi-on-btn').style.display = 'inline-block';
});

// Service Worker Registration
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
////
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      console.log('Service Worker registered with scope: ', registration.scope);
    }).catch(function(error) {
      console.log('Service Worker registration failed: ', error);
    });
  });
}

-----------
    navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('sync-data');
});
navigator.serviceWorker.ready.then((registration) => {
  if ('periodicSync' in registration) {
    registration.periodicSync.register({
      tag: 'periodic-sync-tag',  // Unique tag to identify this sync
      minInterval: 24 * 60 * 60 * 1000  // Minimum sync interval (1 day)
    });
  }
});
navigator.serviceWorker.ready.then(function(registration) {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('<Your-VAPID-Public-Key>')
  }).then(function(subscription) {
    console.log('Push Subscription:', JSON.stringify(subscription));
    // Send subscription to the server to send push notifications
  }).catch(function(error) {
    console.error('Error subscribing to push notifications:', error);
  });
});

// Helper function to convert VAPID public key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

