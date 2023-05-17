"use strict";

// key - publically available API so no issue exposing it
const KEY = "3cc93a01996d4195b8f85813231405";

// constants
const API_URL = "http://api.weatherapi.com/v1";
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
      conditionIconUrl: weatherData.condition.icon,
      feelslike_c: weatherData.feelslike_c,
      feelslike_f: weatherData.feelslike_f,
      humidity: weatherData.humidity,
      last_updated: weatherData.last_updated,
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
      region: locationData.region,
    },
  };

  return appData;
}

// init app
getCurrentWeather().then((apiData) => {
  const appData = processWeatherData(apiData);
  console.log(appData.location);
  console.log(appData.weather);
});
