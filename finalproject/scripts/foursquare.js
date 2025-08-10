document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "QVLHWWOZGWGROR41HKS32RW1N0H5XF4VKNEPACBUQBKUM1EE";

  const resultsList = document.getElementById("results");
  const zipInput = document.getElementById("zipInput");
  const zipSearchBtn = document.getElementById("zipSearchBtn");
  const zipError = document.getElementById("zipError");

  // Function to fetch playgrounds using Foursquare API category for playgrounds (16032)
  function fetchPlaygrounds(lat, lon) {
    console.log("Fetching playgrounds near:", lat, lon);
    resultsList.innerHTML = "<li>Loading playgrounds...</li>";

    fetch(`https://api.foursquare.com/v3/places/search?categories=16032&ll=${lat},${lon}&radius=5000&limit=10`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": apiKey
      }
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log("Foursquare data received:", data);
      resultsList.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach(place => {
          const li = document.createElement("li");
          li.textContent = `${place.name} - ${place.location.formatted_address}`;
          resultsList.appendChild(li);
        });
      } else {
        resultsList.innerHTML = "<li>No playgrounds found nearby.</li>";
      }
    })
    .catch(error => {
      console.error("Error fetching playgrounds:", error);
      resultsList.innerHTML = `<li>Error loading playgrounds: ${error.message}</li>`;
    });
  }

  // Try getting user location via geolocation
  if (navigator.geolocation) {
    console.log("Requesting user location...");
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("User location received:", lat, lon);
        fetchPlaygrounds(lat, lon);
      },
      error => {
        console.warn("Geolocation error or denied:", error);
        resultsList.innerHTML = "<li>Please enter a ZIP code to find playgrounds.</li>";
      }
    );
  } else {
    console.warn("Geolocation not supported.");
    resultsList.innerHTML = "<li>Geolocation is not supported. Please enter a ZIP code.</li>";
  }

  // ZIP code search functionality
  if (zipSearchBtn && zipInput && zipError) {
    zipSearchBtn.addEventListener("click", () => {
      const zip = zipInput.value.trim();
      zipError.textContent = "";

      if (!zip.match(/^\d{5}(-\d{4})?$/)) {
        zipError.textContent = "Please enter a valid US ZIP code.";
        return;
      }

      resultsList.innerHTML = "<li>Looking up ZIP code location...</li>";

      fetch(`https://api.zippopotam.us/us/${zip}`)
        .then(response => {
          if (!response.ok) throw new Error("ZIP code not found");
          return response.json();
        })
        .then(data => {
          const place = data.places[0];
          const lat = parseFloat(place.latitude);
          const lon = parseFloat(place.longitude);
          console.log(`ZIP code ${zip} coordinates:`, lat, lon);
          fetchPlaygrounds(lat, lon);
        })
        .catch(err => {
          console.error("Error fetching ZIP code location:", err);
          zipError.textContent = "Invalid ZIP code or unable to fetch location.";
          resultsList.innerHTML = "";
        });
    });
  }
});
