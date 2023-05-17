"use strict";

// key - publically available API so no issue exposing it
const KEY = "3cc93a01996d4195b8f85813231405";

// constants
const API_URL = "https://api.weatherapi.com/v1";
const API_URL_CURRENT = `${API_URL}/current.json?key=${KEY}`;
const API_URL_FORECAST = `${API_URL}/forecast.json?key=${KEY}`;
const API_URL_SEARCH = `${API_URL}/search.json?key=${KEY}`;

const defaultCity = "Vancouver";

// get current weather
async function getCurrentWeather(city = defaultCity) {
  try {
    const response = await fetch(`${API_URL_CURRENT}&q=${city}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// process weather data
function processWeatherData(apiData) {
  const weatherData = apiData.current;
  const locationData = apiData.location;

  const appData = {
    weather: {
      conditionDesc: weatherData.condition.text,
      conditionIconUrl: weatherData.condition.icon.split("//")[1],
      feelslike_c: weatherData.feelslike_c,
      feelslike_f: weatherData.feelslike_f,
      humidity: weatherData.humidity,
      last_updated_date: weatherData.last_updated.split(" ")[0],
      last_updated_time: weatherData.last_updated.split(" ")[1],
      rain: weatherData.precip_mm,
      temp_c: weatherData.temp_c,
      temp_f: weatherData.temp_f,
      wind_speed: weatherData.wind_kph,
    },
    location: {
      city: locationData.name,
      country: locationData.country,
      lat: locationData.lat,
      long: locationData.lon,
      localtime: locationData.localtime,
      region: locationData.region,
    },
  };

  return appData;
}

// DOM nodes
const conditionDescDiv = document.getElementById("conditionDesc");
const locationDiv = document.getElementById("location");
const dayDateDiv = document.getElementById("dayDate");
const lastTimeDiv = document.getElementById("lastTime");
const tempDiv = document.getElementById("temp");
const feelsTempDiv = document.getElementById("feelsTemp");
const humidityDiv = document.getElementById("humidity");
const rainDiv = document.getElementById("rain");
const windDiv = document.getElementById("wind");

// init app
window.addEventListener("DOMContentLoaded", async () => {
  const apiData = await getCurrentWeather();
  const appData = processWeatherData(apiData);

  conditionDescDiv.textContent = appData.weather.conditionDesc;
  locationDiv.textContent = `${appData.location.city}, ${appData.location.country}`;
  dayDateDiv.textContent = new Date(appData.weather.last_updated_date)
    .toUTCString()
    .split("00")[0];
  lastTimeDiv.textContent = new Date(
    appData.location.localtime
  ).toLocaleTimeString();
  tempDiv.textContent = `${appData.weather.temp_c} °C`;
  feelsTempDiv.textContent = `${appData.weather.feelslike_c}°C`
  humidityDiv.textContent = `${appData.weather.humidity}%`
  rainDiv.textContent = `${appData.weather.rain}mm`
  windDiv.textContent = `${appData.weather.wind_speed}km/h`
});
