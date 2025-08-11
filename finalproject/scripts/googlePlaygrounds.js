// googlePlaygrounds.js

let map;
let placesService;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  const zipInput = document.getElementById("zipInput");
  const zipSearchBtn = document.getElementById("zipSearchBtn");
  const zipError = document.getElementById("zipError");

  // Initialize the Google Map centered on Utah (default)
  function initMap() {
    map = new google.maps.Map(document.getElementById("map") || document.createElement('div'), {
      center: { lat: 40.2338, lng: -111.6585 }, // Utah approx center
      zoom: 10,
    });

    placesService = new google.maps.places.PlacesService(map);
  }

  // Create a card element for each playground place
  function createPlaygroundCard(place) {
    const card = document.createElement("div");
    card.classList.add("playground-card");

    const rating = place.rating ? place.rating.toFixed(1) : "N/A";

    card.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.vicinity || place.formatted_address || "Address unavailable"}</p>
      <p>Rating: ${rating} ⭐</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}" target="_blank" rel="noopener">Get Directions</a>
    `;

    return card;
  }

  // Clear all existing markers from the map
  function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
  }

  // Add markers on the map for places
  function addMarkers(places) {
    clearMarkers();

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
    });

    // Adjust map bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (place.geometry && place.geometry.location) {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  }

  // Search playgrounds using Google Places API
  function searchPlaygrounds(location) {
    resultsContainer.innerHTML = "Loading playgrounds...";

    const request = {
      location: location,
      radius: 10000,     // 10 km radius
      keyword: "playground",
    };

    placesService.nearbySearch(request, (results, status) => {
      resultsContainer.innerHTML = "";

      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        // Optionally filter by rating >= 3.5
        const filtered = results.filter(p => p.rating && p.rating >= 3.5);
        const placesToShow = filtered.length ? filtered : results;

        placesToShow.forEach(place => {
          const card = createPlaygroundCard(place);
          resultsContainer.appendChild(card);
        });

        addMarkers(placesToShow);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resultsContainer.textContent = "No playgrounds found nearby.";
        clearMarkers();
      } else {
        resultsContainer.textContent = `Error searching playgrounds: ${status}`;
        clearMarkers();
      }
    });
  }

  // Convert ZIP code to lat/lng and search playgrounds
  function geocodeZip(zip) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: zip }, (results, status) => {
      if (status === "OK" && results[0]) {
        zipError.textContent = "";
        searchPlaygrounds(results[0].geometry.location);
      } else {
        zipError.textContent = "Invalid ZIP code or no results found.";
        resultsContainer.innerHTML = "";
        clearMarkers();
      }
    });
  }

  // Handle ZIP search button click
  zipSearchBtn.addEventListener("click", () => {
    const zip = zipInput.value.trim();
    if (/^\d{5}(-\d{4})?$/.test(zip)) {
      geocodeZip(zip);
    } else {
      zipError.textContent = "Please enter a valid US ZIP code.";
    }
  });

  // Initialize map and try geolocation search on page load
  function init() {
    initMap();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          searchPlaygrounds(userLoc);
        },
        () => {
          resultsContainer.textContent = "Location access denied. Please search by ZIP.";
        }
      );
    } else {
      resultsContainer.textContent = "Geolocation not supported. Please search by ZIP.";
    }
  }

  init();
});
