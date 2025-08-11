document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  const zipInput = document.getElementById("zipInput");
  const zipSearchBtn = document.getElementById("zipSearchBtn");
  const zipError = document.getElementById("zipError");
  const mapElement = document.getElementById("map");

  let map;
  let markers = [];

  function initMap(location) {
    map = new google.maps.Map(mapElement, {
      center: location,
      zoom: 13,
    });
  }

  function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
  }

  function createPlaygroundCard(place) {
    const card = document.createElement("div");
    card.classList.add("playground-places-card");
    
    const rating = place.rating ? place.rating.toFixed(1) : "N/A";
    card.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.vicinity || place.formatted_address}</p>
      <p>Rating: ${rating} ⭐</p>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}" target="_blank" rel="noopener">Get Directions</a>
    `;

    return card;
  }

  function addMarker(place) {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${place.name}</strong><br>Rating: ${place.rating ? place.rating.toFixed(1) : "N/A"} ⭐`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  }

  function searchPlaygrounds(location) {
    if (!map) initMap(location);
    else map.setCenter(location);

    resultsContainer.innerHTML = "Loading playgrounds...";
    clearMarkers();

    const placesService = new google.maps.places.Place(map);

    const request = {
      location: location,
      radius: 5000,
      keyword: "playground",
      type: ["park"]
    };

    places.nearbySearch(request, (results, status) => {
      resultsContainer.innerHTML = "";
      if (status === google.maps.places.PlacesStatus.OK && results.length > 0) {
        const filtered = results.filter(p => p.rating && p.rating >= 3.5);

        if (filtered.length === 0) {
          resultsContainer.textContent = "No highly rated playgrounds found nearby.";
          return;
        }

        filtered.forEach(place => {
          const card = createPlaygroundCard(place);
          resultsContainer.appendChild(card);
          addMarker(place);
        });
      } else {
        resultsContainer.textContent = "No playgrounds found.";
      }
    });
  }

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

  zipSearchBtn.addEventListener("click", () => {
    const zip = zipInput.value.trim();
    if (/^\d{5}(-\d{4})?$/.test(zip)) {
      geocodeZip(zip);
    } else {
      zipError.textContent = "Please enter a valid US ZIP code.";
    }
  });

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
