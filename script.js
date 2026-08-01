const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name");
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    } else {
      alert("Please enter a city name");
    }
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );
    const data = await response.json();
    if (data.results && data.results.length === 0) {
      throw new Error("City not found");
    }
    const place = data.results[0];
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
    );
    const weatherData = await weatherResponse.json();
    cityName.textContent = `${place.name}, ${place.country}`;
    temperature.textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
    humidity.textContent = `${weatherData.current.relative_humidity_2m}%`;
    wind.textContent = `${Math.round(weatherData.current.wind_speed_10m)}km/h`;
    description.textContent = getWeatherDescription(
      weatherData.current.weather_code,
    );
  } catch (error) {
    cityName.textContent = "City not found";
    temperature.textContent = "--°C";
    description.textContent = "Please enter a valid city.";
    humidity.textContent = "--";
    wind.textContent = "--";
  }
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Heavy Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Moderate Rain Showers",
    82: "Heavy Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Severe Thunderstorm",
  };
  return weatherCodes[code] || "Unknown Weather";
}
