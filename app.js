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

// get current weather
async function getForecastWeather(city = defaultCity) {
  try {
    const response = await fetch(`${API_URL_FORECAST}&q=${city}`);
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

// process forecast data
function processForecastData(apiForecastData) {
  const completeHourlyForecast = apiForecastData.forecast.forecastday[0].hour;
  const eachThreeHrForecast = completeHourlyForecast.filter((value, index) => {
    return index % 3 == 0;
  });
  const hourlyForecast = eachThreeHrForecast.map((value) => {
    return {
      condition: value.condition.text,
      icon: value.condition.icon.split("//")[1],
      time: value.time.split(" ")[1],
      temp: value.temp_c,
    };
  });

  return hourlyForecast;
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
const searchBtn = document.getElementById("searchBtn");
const searchInp = document.getElementById("searchInp");
const searchForm = document.getElementById("searchForm");
const forecastDiv = document.getElementById("forecastDiv");

// render function
function renderDOM(appData, hourlyForecast) {
  conditionDescDiv.textContent = appData.weather.conditionDesc;
  locationDiv.textContent = `${appData.location.city}, ${appData.location.country}`;
  dayDateDiv.textContent = new Date(appData.weather.last_updated_date)
    .toUTCString()
    .split("00")[0];
  lastTimeDiv.textContent = new Date(
    appData.location.localtime
  ).toLocaleTimeString();
  tempDiv.textContent = `${appData.weather.temp_c} °C`;
  feelsTempDiv.textContent = `${appData.weather.feelslike_c}°C`;
  humidityDiv.textContent = `${appData.weather.humidity}%`;
  rainDiv.textContent = `${appData.weather.rain}mm`;
  windDiv.textContent = `${appData.weather.wind_speed}km/h`;

  forecastDiv.innerHTML = "";
  for (let block of hourlyForecast) {
    const forecastItemDiv = document.createElement("div");
    forecastItemDiv.className = "forecastItem";

    const forecastTimeDiv = document.createElement("div");
    forecastTimeDiv.className = "forecastTime";
    forecastTimeDiv.textContent = block.time;
    forecastItemDiv.appendChild(forecastTimeDiv);

    const forecastTempDiv = document.createElement("div");
    forecastTempDiv.className = "forecastTemp";
    forecastTempDiv.textContent = `${block.temp}°C`;
    forecastItemDiv.appendChild(forecastTempDiv);

    const forecastImg = document.createElement("img");
    forecastImg.src = `https://${block.icon}`;
    forecastItemDiv.appendChild(forecastImg);

    const forecastCondDiv = document.createElement("div");
    forecastCondDiv.textContent = block.condition;
    forecastItemDiv.appendChild(forecastCondDiv);

    forecastDiv.appendChild(forecastItemDiv);
  }
}

// location search function
async function searchLocation(city = defaultCity) {
  const apiData = await getCurrentWeather(city);
  const appData = processWeatherData(apiData);
  const apiForecastData = await getForecastWeather(city);
  const hourlyForecast = processForecastData(apiForecastData);
  renderDOM(appData, hourlyForecast);
  searchInp.value = "";
}
function handleSubmit(e) {
  e.preventDefault();
  searchLocation(searchInp.value);
}
searchBtn.addEventListener("click", handleSubmit);
searchForm.addEventListener("submit", handleSubmit);

// init app
window.addEventListener("DOMContentLoaded", async () => {
  const apiCurrentData = await getCurrentWeather();
  const appCurrentData = processWeatherData(apiCurrentData);

  const apiForecastData = await getForecastWeather();
  const hourlyForecast = processForecastData(apiForecastData);
  console.log(hourlyForecast);

  renderDOM(appCurrentData, hourlyForecast);
});
