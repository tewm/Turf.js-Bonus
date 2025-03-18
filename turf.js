// Initialize the map
var map = L.map('map').setView([20, 0], 2); // World view

// Add a basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load the GeoJSON airport dataset
fetch('airports.geojson')  // Ensure this file is in the same directory
    .then(response => response.json())
    .then(airportData => {
        
        // Add airport markers to the map
        var airportLayer = L.geoJSON(airportData, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    fillColor: "blue",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(`<b>${feature.properties.name}</b>`);
            }
        }).addTo(map);

        // Handle user clicks to find the nearest airport
        map.on('click', function (e) {
            var userPoint = turf.point([e.latlng.lng, e.latlng.lat]);
            var nearest = turf.nearestPoint(userPoint, airportData);

            if (nearest) {
                var coords = nearest.geometry.coordinates;
                var airportName = nearest.properties.name || "Unknown Airport";

                // Show a popup with the nearest airport info
                L.popup()
                    .setLatLng([coords[1], coords[0]])  // GeoJSON stores coordinates as [lng, lat]
                    .setContent(`<b>Nearest Airport:</b> ${airportName}<br>Coordinates: ${coords[1]}, ${coords[0]}`)
                    .openOn(map);
            }
        });
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
