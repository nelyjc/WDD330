const playgrounds = [
  {
    name: "Discovery Park",
    city: "Pleasant Grove",
    hasShade: true,
    features: ["Swings", "Slides", "Climbing structures"],
    imageUrl: "https://www.pleasantgrovecity.com/ImageRepository/Document?documentID=4866"
  },
  {
    name: "Pioneer Park",
    city: "Provo",
    hasShade: false,
    features: ["Water play", "Grass fields", "Restrooms"],
    imageUrl: "https://www.provo.org/home/showpublishedimage/1713/636754454972470000"
  },
  {
    name: "Harvey Park",
    city: "Springville",
    hasShade: true,
    features: ["Picnic tables", "Large shaded area", "Playground structure"],
    imageUrl: "https://springville.org/wp-content/uploads/HarveyPark.jpg"
  },
  {
    name: "Spanish Fork Sports Park",
    city: "Spanish Fork",
    hasShade: true,
    features: ["Sports fields", "Splash pad", "Shade canopies"],
    imageUrl: "https://spanishfork.org/images/departments/parks_rec/sports_park.jpg"
  }
];

function renderPlaygrounds(list) {
  const container = document.getElementById("playgroundCards");
  container.innerHTML = "";
  list.forEach(pg => {
    const card = document.createElement("section");
    card.innerHTML = `
      <h2>${pg.name}</h2>
      <img src="${pg.imageUrl}" alt="Photo of ${pg.name}" loading="lazy">
      <p><strong>City:</strong> ${pg.city}</p>
      <p><strong>Shade Available:</strong> ${pg.hasShade ? "Yes" : "No"}</p>
      <p><strong>Features:</strong> ${pg.features.join(", ")}</p>
    `;
    container.appendChild(card);
  });
}

function filterPlaygrounds(filter) {
  let filtered = playgrounds;
  if (filter === "shade") {
    filtered = playgrounds.filter(pg => pg.hasShade);
  } else if (filter === "no-shade") {
    filtered = playgrounds.filter(pg => !pg.hasShade);
  } else if (filter === "provo") {
    filtered = playgrounds.filter(pg => pg.city.toLowerCase() === "provo");
  }
  renderPlaygrounds(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  renderPlaygrounds(playgrounds);
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;
});
