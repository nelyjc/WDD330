const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=40.2338&lon=-111.6585&appid=7413de7dfbb3995c8c577613f472a101&units=imperial`;
;
;

async function getWeather() {
  try {
    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }

    const data = await response.json();

    const temp = document.getElementById("temp");
    const description = document.getElementById("description");
    const icon = document.getElementById("weather-icon");

    temp.textContent = `${data.main.temp.toFixed(1)}°F`;
    description.textContent = data.weather[0].description;
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
    icon.setAttribute("alt", data.weather[0].description);

  } catch (error) {
    console.error("Error fetching weather:", error);
    const weatherBox = document.querySelector(".weather-box");
    weatherBox.innerHTML = "<p>Weather data unavailable right now.</p>";
  }
}

document.addEventListener("DOMContentLoaded", getWeather);