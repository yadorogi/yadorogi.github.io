// Initialize the map
function initMap() {
    // Create a new map instance
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Set the initial map center
        zoom: 12, // Set the initial zoom level
    });

    // Array to store the markers
    const markers = [];

    // Add a click event listener to the map
    map.addListener("click", (event) => {
        // Create a new marker at the clicked location
        const marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
        });

        // Add the marker to the array
        markers.push(marker);
    });

    // Function to cycle through the markers
    function cycleMarkers() {
        let currentIndex = 0;

        setInterval(() => {
            // Remove the previous marker from the map
            if (currentIndex > 0) {
                markers[currentIndex - 1].setMap(null);
            }

            // Add the current marker to the map
            markers[currentIndex].setMap(map);

            // Increment the current index
            currentIndex = (currentIndex + 1) % markers.length;

            // Calculate and display the optimized route
            if (currentIndex === 0) {
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                });

                const waypoints = markers.map((marker) => ({
                    location: marker.getPosition(),
                    stopover: true,
                }));

                directionsService.route(
                    {
                        origin: waypoints[0].location,
                        destination: waypoints[0].location,
                        waypoints: waypoints.slice(1),
                        optimizeWaypoints: true,
                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (response, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(response);
                        } else {
                            console.log("Directions request failed due to " + status);
                        }
                    }
                );
            }
        }, 2000); // Change the interval as needed
    }

    // Call the cycleMarkers function to start cycling through the markers
    cycleMarkers();
}
