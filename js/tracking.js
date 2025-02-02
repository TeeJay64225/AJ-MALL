// tracking.js

// Initialize the map
function initMap() {
    // Sample coordinates (replace with real tracking data from backend)
    let driverLocation = { lat: -34.397, lng: 150.644 };
    const deliveryLocation = { lat: -34.395, lng: 150.650 };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: driverLocation,
        styles: [/* Custom map styles */]
    });

    // Add markers for driver and delivery location
    const driverMarker = new google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
            url: '../../assets/images/delivery-truck.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        title: 'Delivery Driver'
    });

    const destinationMarker = new google.maps.Marker({
        position: deliveryLocation,
        map: map,
        icon: {
            url: '../../assets/images/destination.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        title: 'Delivery Location'
    });

    // Draw route between points
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true
    });

    function updateRoute() {
        const request = {
            origin: driverLocation,
            destination: deliveryLocation,
            travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function (result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            }
        });
    }

    updateRoute();

    // Simulate driver movement (Replace this with real-time location updates from the backend)
    function updateDriverLocation() {
        fetch('/api/driver-location') // Replace with your actual backend endpoint
            .then(response => response.json())
            .then(data => {
                if (data.lat && data.lng) {
                    driverLocation = { lat: data.lat, lng: data.lng };
                    driverMarker.setPosition(driverLocation);
                    updateRoute();
                }
            })
            .catch(error => console.error('Error fetching driver location:', error));
    }

    // Update driver location every 5 seconds (adjust as needed)
    setInterval(updateDriverLocation, 5000);
}

// Load the map when the window loads
window.onload = initMap;
