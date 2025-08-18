document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("water-playgrounds-container");
  if (!container) return;

  // 3 water playgrounds data (from your JSON)
  const waterPlaygrounds = [
    {
      name: "Kiwanis Park",
      address: "900 S 500 E, Provo, UT",
      image: "kiwanis.webp",
      features: "Playground, Splash Pad, Picnic Areas, Walking Trails",
      website: "https://goo.gl/maps/yN7aPoMrCVE2",
      city: "Provo",
      description: "A large park with plenty of shaded play areas and a splash pad to keep kids cool."
    },
    {
      name: "Discovery Park",
      address: "950 N 400 W, Orem, UT",
      image: "discoverypark.webp",
      features: "Playground, Splash Pad, Sports Fields, Open Grass Areas",
      website: "https://goo.gl/maps/jxv1Z1WUd6N2",
      city: "Orem",
      description: "Popular family park with splash pad and large playground equipment."
    },
    {
      name: "Murdock Canal Trail Park",
      address: "4700 W Center St, Lehi, UT",
      image: "murdockcanal.webp",
      features: "Playground, Splash Pad, Walking and Biking Trails",
      website: "https://goo.gl/maps/JKrRgV4djMs",
      city: "Lehi",
      description: "Ideal for kids to play and cool off at the splash pad after biking or walking the trail."
    }
  ];

  function displayPlaygrounds(playgrounds) {
    container.innerHTML = ""; // clear

    playgrounds.forEach(pg => {
      const card = document.createElement("div");
      card.classList.add("playground-card");
      card.innerHTML = `
        <img src="images/${pg.image}" alt="${pg.name}" loading="lazy">
        <h2>${pg.name}</h2>
        <p><strong>Address:</strong> ${pg.address}</p>
        <p><strong>City:</strong> ${pg.city}</p>
        <p><strong>Features:</strong> ${pg.features}</p>
        <p>${pg.description}</p>
        <a href="${pg.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
      `;
      container.appendChild(card);
    });
  }

  displayPlaygrounds(waterPlaygrounds);
});
