// =================================================================
// GLOBAL SCOPE
// =================================================================

// Global variables to be used by multiple functions
let map;
let placesService;
let infoWindow;
let playgroundMarkers = [];
const EVENTBRITE_TOKEN = "F7U4LNYTOQLMM3EFCZPR"; // Your Eventbrite Token

/**
 * This is the only global function. It is called by the Google Maps script
 * once the API has fully loaded. It's the starting point for our app.
 */
function initMap() {
    // This is the code that runs first, creating the map.
    const defaultLoc = { lat: 39.8283, lng: -98.5795 };
    const mapContainer = document.getElementById("map");

    map = new google.maps.Map(mapContainer, {
        center: defaultLoc,
        zoom: 4,
    });

    // Initialize services that depend on the map
    placesService = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();

    // Now that the map is ready, set up the rest of the application's logic.
    startApp();
}

/**
 * This function sets up all event listeners and application logic.
 * It is called by initMap() to ensure it only runs AFTER the map is ready.
 */
function startApp() {
    // =================================================================
    // GET DOM ELEMENTS
    // =================================================================
    const zipInput = document.getElementById("zipInput");
    const zipSearchBtn = document.getElementById("zipSearchBtn");
    const zipError = document.getElementById("zipError");
    const resultsContainer = document.getElementById("resultsContainer");

    const eventZipInput = document.getElementById("eventZipInput");
    const eventSearchBtn = document.getElementById("eventSearchBtn");
    const eventError = document.getElementById("eventError");
    const eventsResults = document.getElementById("eventsResults");

    // =================================================================
    // SETUP EVENT LISTENERS
    // =================================================================
    zipSearchBtn.addEventListener("click", () => {
        const zip = zipInput.value.trim();
        if (/^\d{5}(-\d{4})?$/.test(zip)) {
            zipError.textContent = "";
            geocodeAndSearchPlaygrounds(zip);
        } else {
            zipError.textContent = "Please enter a valid US ZIP code.";
        }
    });

    eventSearchBtn.addEventListener("click", () => {
        const zip = eventZipInput.value.trim();
        if (/^\d{5}(-\d{4})?$/.test(zip)) {
            eventError.textContent = "";
            fetchEvents(zip);
        } else {
            eventError.textContent = "Please enter a valid US ZIP code.";
        }
    });

    // =================================================================
    // PLAYGROUND FINDER FUNCTIONS
    // =================================================================
    function geocodeAndSearchPlaygrounds(zip) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: zip }, (results, status) => {
            if (status === "OK" && results[0] && results[0].geometry) {
                searchPlaygrounds(results[0].geometry.location);
            } else {
                zipError.textContent = "Could not find location for that ZIP code.";
            }
        });
    }

    function searchPlaygrounds(location) {
        resultsContainer.innerHTML = "Loading playgrounds...";
        clearPlaygroundMarkers();
        map.setCenter(location);
        map.setZoom(12);

        const request = {
            location: location,
            radius: 5000,
            keyword: "playground",
            type: ["park"],
        };

        placesService.nearbySearch(request, (results, status) => {
            resultsContainer.innerHTML = "";
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const filtered = results.filter(p => p.rating && p.rating >= 3.5);
                if (filtered.length === 0) {
                    resultsContainer.textContent = "No highly rated playgrounds found.";
                    return;
                }
                filtered.forEach(place => {
                    resultsContainer.appendChild(createPlaygroundCard(place));
                    createPlaygroundMarker(place);
                });
            } else {
                resultsContainer.textContent = "No playgrounds found.";
            }
        });
    }

    function createPlaygroundCard(place) {
        const card = document.createElement("div");
        card.classList.add("playground-card");
        const rating = place.rating ? place.rating.toFixed(1) : "N/A";
        const address = place.vicinity || "Address not available";
        card.innerHTML = `<h3>${place.name}</h3><p>${address}</p><p>Rating: ${rating} ⭐</p>`;
        return card;
    }

    function createPlaygroundMarker(place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });
        playgroundMarkers.push(marker);
        marker.addListener("click", () => {
            infoWindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity || ''}`);
            infoWindow.open(map, marker);
        });
    }

    function clearPlaygroundMarkers() {
        playgroundMarkers.forEach(marker => marker.setMap(null));
        playgroundMarkers = [];
    }

    // =================================================================
    // EVENT FINDER FUNCTIONS
    // =================================================================
    function fetchEvents(zip) {
        eventsResults.innerHTML = "Loading events...";
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: zip }, (results, status) => {
            if (status === "OK" && results[0] && results[0].geometry) {
                const location = results[0].geometry.location;
                const url = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${location.lat()}&location.longitude=${location.lng()}&location.within=10mi&expand=venue`;

                fetch(url, { headers: { Authorization: `Bearer ${EVENTBRITE_TOKEN}` } })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return response.json();
                    })
                    .then(data => displayEvents(data.events))
                    .catch(error => {
                        eventError.textContent = "Error fetching events. This may be due to browser security (CORS).";
                        eventsResults.innerHTML = "";
                        console.error("Fetch Error:", error);
                    });
            } else {
                eventError.textContent = "Invalid ZIP code or location could not be found.";
                eventsResults.innerHTML = "";
            }
        });
    }

    function displayEvents(events) {
        if (!events || events.length === 0) {
            eventsResults.innerHTML = "<p>No events found nearby.</p>";
            return;
        }
        eventsResults.innerHTML = "";
        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-card");
            const startDate = new Date(event.start.local).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            const imageUrl = event.logo?.url || '';
            const venueName = event.venue?.name || 'Venue not specified';
            const description = event.description?.text ? (event.description.text.substring(0, 150) + "...") : "No description available.";
            
            eventDiv.innerHTML = `
                ${imageUrl ? `<img src="${imageUrl}" alt="${event.name.text}" class="event-image">` : ''}
                <div class="event-details">
                    <h3><a href="${event.url}" target="_blank" rel="noopener">${event.name.text}</a></h3>
                    <p><strong>When:</strong> ${startDate}</p>
                    <p><strong>Where:</strong> ${venueName}</p>
                    <p>${description}</p>
                </div>
            `;
            eventsResults.appendChild(eventDiv);
        });
    }
}