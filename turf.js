<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nearest Airport Finder</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/@turf/turf/turf.min.js"></script>
    <style>
        #map { height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        // Initialize the map
        var map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Load the GeoJSON dataset
        fetch('airports.geojson')
            .then(response => response.json())
            .then(data => {
                var geojsonLayer = L.geoJSON(data).addTo(map);

                map.on('click', function (e) {
                    var clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);
                    var nearest = turf.nearestPoint(clickedPoint, data);
                    
                    if (nearest) {
                        var props = nearest.properties;
                        L.popup()
                            .setLatLng([props.latitude, props.longitude])
                            .setContent(`<b>${props.name}</b><br>${props.city}, ${props.country}`)
                            .openOn(map);
                    }
                });
            });
    </script>
</body>
</html>
