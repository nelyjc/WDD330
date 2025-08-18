// Global variables to store the map, services, and markers.
// These are declared here so they can be accessed by all functions.
let map;
let placesService;
let markers = [];

/**
 * The main callback function for the Google Maps API.
 * This is the first function to run after the API script has loaded.
 */
function initMap() {
    // Check if the HTML elements exist before trying to create the map.
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Map element with id 'map' not found in the DOM.");
        return;
    }

    // Initialize the map and the PlacesService.
    map = new google.maps.Map(mapElement, {
        center: { lat: 40.2338, lng: -111.6585 }, // Default center: Utah County
        zoom: 10,
    });

    placesService = new google.maps.places.PlacesService(map);

    // Initial search attempt using the user's current location.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                searchPlaygrounds(userLoc);
            },
            () => {
                document.getElementById("results").textContent = "Location access denied. Please search by ZIP.";
            }
        );
    } else {
        document.getElementById("results").textContent = "Geolocation not supported. Please search by ZIP.";
    }

    // Set up event listeners for the search buttons.
    // This is done inside initMap() to ensure 'google' is defined.
    const zipInput = document.getElementById("zipInput");
    const zipSearchBtn = document.getElementById("zipSearchBtn");
    const zipError = document.getElementById("zipError");
    
    if (zipSearchBtn) {
        zipSearchBtn.addEventListener("click", () => {
            const zip = zipInput.value.trim();
            if (/^\d{5}(-\d{4})?$/.test(zip)) {
                zipError.textContent = "";
                geocodeZip(zip);
            } else {
                zipError.textContent = "Please enter a valid US ZIP code.";
            }
        });
    } else {
        console.error("ZIP search button not found.");
    }
}

/**
 * Creates an HTML card element for a single playground place.
 */
function createPlaygroundCard(place) {
    const card = document.createElement("div");
    card.classList.add("playground-card");
    const rating = place.rating ? place.rating.toFixed(1) : "N/A";
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`;
    card.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.vicinity || place.formatted_address || "Address unavailable"}</p>
        <p>Rating: ${rating} ⭐</p>
        <a href="${directionsUrl}" target="_blank" rel="noopener">Get Directions</a>
    `;
    return card;
}

/**
 * Clears all existing markers from the map.
 */
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

/**
 * Adds markers to the map for each place in the provided array.
 */
function addMarkers(places) {
    clearMarkers();
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
        if (!place.geometry || !place.geometry.location) return;
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name,
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${place.name}</strong><br>${place.vicinity || place.formatted_address || ""}`
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        markers.push(marker);
        bounds.extend(place.geometry.location);
    });
    if (places.length > 0) {
        map.fitBounds(bounds);
    }
}

/**
 * Searches for playgrounds near a given location using the Places API.
 */
function searchPlaygrounds(location) {
    document.getElementById("results").innerHTML = "Loading playgrounds...";
    const request = {
        location: location,
        radius: 15000,
        keyword: "playground",
        type: ["park"],
    };
    placesService.nearbySearch(request, (results, status) => {
        document.getElementById("results").innerHTML = "";
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            const filtered = results.filter(p => p.rating && p.rating >= 3.5);
            const placesToShow = filtered.length ? filtered : results;
            map.setCenter(location);
            placesToShow.forEach(place => {
                document.getElementById("results").appendChild(createPlaygroundCard(place));
            });
            addMarkers(placesToShow);
        } else {
            document.getElementById("results").textContent = "No playgrounds found nearby.";
            clearMarkers();
        }
    });
}

/**
 * Converts a ZIP code to geographical coordinates and then searches.
 */
function geocodeZip(zip) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: zip }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
            searchPlaygrounds(results[0].geometry.location);
        } else {
            document.getElementById("zipError").textContent = "Invalid ZIP code or no results found.";
            document.getElementById("results").innerHTML = "";
            clearMarkers();
        }
    });
}