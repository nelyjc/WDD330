
document.addEventListener("DOMContentLoaded", () => {
    // --- Global variables ---
    
    let map;
    let placesService;
    let infoWindow;
    let markers = []; // Array to store markers for easy clearing

    const resultsContainer = document.getElementById("results");
    const zipInput = document.getElementById("zipInput");
    const zipSearchBtn = document.getElementById("zipSearchBtn");
    const zipError = document.getElementById("zipError");
    const mapContainer = document.getElementById("map"); // Get the map div

    // --- Initialize the Map ---
    // This function is called once the Google Maps script loads
    
    window.initMap = function() {
        // Default location (center of the US)
        const defaultLoc = { lat: 39.8283, lng: -98.5795 };

        map = new google.maps.Map(mapContainer, {
            center: defaultLoc,
            zoom: 4, // Zoom out to see the whole country initially
        });
        

        placesService = new google.maps.places.placeService(map);
        infoWindow = new google.maps.InfoWindow();

        // On page load, try geolocation and show playgrounds nearby
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLoc = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    searchPlaygrounds(userLoc);
                },
                () => {
                    // Handle location access denial
                    resultsContainer.textContent = "Location access denied. Please search by ZIP code.";
                }
            );
        }
    }

    // --- Helper Functions ---

    // Create a playground card dynamically
    function createPlaygroundCard(place) {
        const card = document.createElement("div");
        card.classList.add("playground-card");

        const rating = place.rating ? place.rating.toFixed(1) : "N/A";
        const address = place.vicinity || place.formatted_address || "Address not available";

        // Note: Corrected the Google Maps URL
        card.innerHTML = `
      <h3>${place.name}</h3>
      <p>${address}</p>
      <p>Rating: ${rating} ⭐</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}" target="_blank" rel="noopener">Get Directions</a>
    `;

        return card;
    }

    // Create a map marker for a place
    function createMarker(place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });

        markers.push(marker); // Add to our markers array

        // Add a click listener to each marker to show an info window
        google.maps.event.addListener(marker, "click", () => {
            infoWindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
            infoWindow.open(map, marker);
        });
    }
    
    // Clear markers from the map before a new search
    function clearMarkers() {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null); // Remove marker from map
        }
        markers = []; // Empty the array
    }


    // --- Core Search and Geocoding Functions ---

    // Search playgrounds using Google Places API near a location
    function searchPlaygrounds(location) {
        resultsContainer.innerHTML = "Loading playgrounds...";
        clearMarkers(); // Clear old markers from the map

        // Center the map on the new search location and zoom in
        map.setCenter(location);
        map.setZoom(12);

        const request = {
            location: location,
            radius: 5000, // 5 km radius
            keyword: "playground",
            type: ["park"],
        };

        placesService.nearbySearch(request, (results, status) => {
            resultsContainer.innerHTML = ""; // Clear the loading message

            if (status === google.maps.places.PlaceStatus.OK && results) {
                // Filter for better results
                const filtered = results.filter(place => place.rating && place.rating >= 3.5);

                if (filtered.length === 0) {
                    resultsContainer.textContent = "No highly rated playgrounds found nearby.";
                    return;
                }

                // Create cards and markers for each result
                filtered.forEach(place => {
                    resultsContainer.appendChild(createPlaygroundCard(place));
                    createMarker(place);
                });
            } else {
                resultsContainer.textContent = "No playgrounds found.";
            }
        });
    }

    // Convert ZIP code to lat/lng using Geocoder, then search
    function geocodeZip(zip) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: zip, componentRestrictions: { country: 'US' } }, (results, status) => {
            if (status === "OK" && results[0]) {
                searchPlaygrounds(results[0].geometry.location);
                zipError.textContent = "";
            } else {
                zipError.textContent = "Invalid ZIP code.";
                resultsContainer.innerHTML = "";
            }
        });
    }

    // --- Event Listeners ---
    zipSearchBtn.addEventListener("click", () => {
        const zip = zipInput.value.trim();
        if (/^\d{5}(-\d{4})?$/.test(zip)) {
            geocodeZip(zip);
        } else {
            zipError.textContent = "Please enter a valid US ZIP code.";
            resultsContainer.innerHTML = "";
        }
    });
    zipInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            zipSearchBtn.click(); // Trigger search on Enter key
        }
    });
    initMap();
});