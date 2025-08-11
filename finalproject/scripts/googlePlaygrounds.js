document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  const zipInput = document.getElementById("zipInput");
  const zipSearchBtn = document.getElementById("zipSearchBtn");
  const zipError = document.getElementById("zipError");

  // Setup dummy map (required for PlacesService)
  const map = new google.maps.Map(document.createElement('div'));
  const placesService = new google.maps.places.PlacesService(map);

  // Dynamic creation of playground cards
  function createPlaygroundCard(place) {
    const card = document.createElement("div");
    card.classList.add("playground-card");
    
    const rating = place.rating ? place.rating.toFixed(1) : "N/A";
    card.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.formatted_address}</p>
      <p>Rating: ${rating} ⭐</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}" target="_blank" rel="noopener">Get Directions</a>
    `;

    return card;
  }

  // Search playgrounds with Google Places API
  function searchPlaygrounds(location) {
    resultsContainer.innerHTML = "Loading playgrounds...";

    const request = {
      location: location,
      radius: 5000,
      keyword: "playground",
      type: ["park"]
    };

    placesService.nearbySearch(request, (results, status) => {
      resultsContainer.innerHTML = "";
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        // Filter by rating >= 3.5 for robustness
        const filtered = results.filter(p => p.rating && p.rating >= 3.5);

        filtered.forEach(place => {
          const card = createPlaygroundCard(place);
          resultsContainer.appendChild(card);
        });
      } else {
        resultsContainer.textContent = "No playgrounds found.";
      }
    });
  }

  // Geocode ZIP to lat/lng and search playgrounds
  function geocodeZip(zip) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: zip }, (results, status) => {
      if (status === "OK" && results[0]) {
        searchPlaygrounds(results[0].geometry.location);
        zipError.textContent = "";
      } else {
        zipError.textContent = "Invalid ZIP code.";
        resultsContainer.innerHTML = "";
      }
    });
  }

  // Event listener for ZIP search
  zipSearchBtn.addEventListener("click", () => {
    const zip = zipInput.value.trim();
    if (/^\d{5}(-\d{4})?$/.test(zip)) {
      geocodeZip(zip);
    } else {
      zipError.textContent = "Please enter a valid US ZIP code.";
    }
  });

  // Try geolocation on page load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
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
});
