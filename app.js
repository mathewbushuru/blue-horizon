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

getCurrentWeather().then(console.log);
