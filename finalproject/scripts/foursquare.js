document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "QVLHWWOZGWGROR41HKS32RW1N0H5XF4VKNEPACBUQBKUM1EE";

  const resultsList = document.getElementById("results");
  const zipInput = document.getElementById("zipInput");
  const zipSearchBtn = document.getElementById("zipSearchBtn");
  const zipError = document.getElementById("zipError");

  // Fetch playgrounds with either lat/lon or near (e.g. ZIP code)
  function fetchPlaygrounds({ lat, lon, near }) {
    let url = `https://api.foursquare.com/v3/places/search?categories=16032&limit=10&radius=5000`;

    if (near) {
      url += `&near=${encodeURIComponent(near)}`;
    } else if (lat && lon) {
      url += `&ll=${lat},${lon}`;
    } else {
      console.error("No location provided to fetchPlaygrounds");
      return;
    }

    resultsList.innerHTML = "<li>Loading playgrounds...</li>";

    fetch(url, {
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
      console.log("Foursquare data:", data);
      resultsList.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.forEach(place => {
          const li = document.createElement("li");
          li.textContent = `${place.name} - ${place.location.formatted_address || place.location.address || "Address not available"}`;
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

  // Geolocation: get user location and fetch playgrounds
  if (navigator.geolocation) {
    console.log("Requesting user location...");
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("User location received:", lat, lon);
        fetchPlaygrounds({ lat, lon });
      },
      error => {
        console.warn("Geolocation error or denied:", error);
        resultsList.innerHTML = "<li>Please enter a ZIP code to find playgrounds.</li>";
      }
    );
  } else {
    console.warn("Geolocation not supported.");
    resultsList.innerHTML = "<li>Geolocation not supported. Please enter a ZIP code.</li>";
  }

  // ZIP code search event
  if (zipSearchBtn && zipInput && zipError) {
    zipSearchBtn.addEventListener("click", () => {
      const zip = zipInput.value.trim();
      zipError.textContent = "";

      if (!zip.match(/^\d{5}(-\d{4})?$/)) {
        zipError.textContent = "Please enter a valid US ZIP code.";
        return;
      }

      fetchPlaygrounds({ near: zip });
    });
  }
});
