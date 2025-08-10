document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("playground-container");
  const playgroundsURL = "data/playgrounds.json";

  async function getPlaygroundsData() {
    try {
      const response = await fetch(playgroundsURL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Take only the first 3 playgrounds
      const featuredPlaygrounds = data.playgrounds.slice(0, 3);

      displayPlaygrounds(featuredPlaygrounds);
    } catch (error) {
      console.error("Could not fetch playground data:", error);
      container.innerHTML = '<p class="error-message">Playground info unavailable. Try again later.</p>';
    }
  }

  function displayPlaygrounds(playgroundsArray) {
    if (!container) return;
    container.innerHTML = ""; // Clear old content

    playgroundsArray.forEach(playground => {
      const card = document.createElement("div");
      card.classList.add("playground-card");

      card.innerHTML = `
        <img src="images/${playground.image}" alt="${playground.name}" class="playground-image" loading="lazy">
        <h2>${playground.name}</h2>
        <p><strong>Address:</strong> ${playground.address}</p>
        <p><strong>City:</strong> ${playground.city}</p>
        <p><strong>Features:</strong> ${playground.features}</p>
        <p>${playground.description}</p>
        <a href="${playground.website}" target="_blank" rel="noopener noreferrer"> Click here for Directions</a>
      `;

      container.appendChild(card);
    });
  }

  getPlaygroundsData();
});
