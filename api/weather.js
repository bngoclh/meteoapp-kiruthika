// weather.js

import axios from "axios/dist/axios";
import { apiKey } from "../constants";

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&lang=fr`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}&lang=fr`;

// Function to fetch weather alerts
const fetchWeatherAlerts = params => {
  const { cityName } = params;
  return axios.get(`https://api.weatherapi.com/v1/alert.json?key=${apiKey}&q=${cityName}&alerts=yes`)
    .then(response => response.data)
    .catch(error => {
      console.log('Error fetching weather alerts: ', error);
      return {};
    });
};

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log('error: ', error);
    return {};
  }
};

export const fetchWeatherForecast = params => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
};

export const fetchLocations = params => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
};

// Export the fetchWeatherAlerts function
export { fetchWeatherAlerts };
