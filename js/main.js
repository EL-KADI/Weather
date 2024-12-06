const apiKey = "0495d90b618643629d8145035240612";
const tempCElement = document.getElementById("temp");
const locationC = document.getElementById("locationC");
const tempT = document.getElementById("tempFt");
const tempC = document.getElementById("tempC");

async function getIpAddress() {
  const ipInfoUrl = "https://ipinfo.io/json";
  try {
    const response = await fetch(ipInfoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch IP address");
    }
    const data = await response.json();
    const ip = data.ip;
    const location = data.city || "auto";
    return location;
  } catch (error) {
    console.error("Error fetching IP address:", error.message);
    return "auto";
  }
}

async function fetchLocationData(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    locationC.textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    tempCElement.textContent = `${data.current.temp_c}°C`;

    const condition = data.current.condition.text.toLowerCase();
    const temp = data.current.temp_c;

    const sunIcon = document.querySelectorAll(".custom-ic-one");
    const cloudIcon = document.querySelectorAll(".custom-ic-tow");
    const conditionText = document.querySelectorAll(".custom-h6");

    if (
      sunIcon.length > 0 &&
      cloudIcon.length > 0 &&
      conditionText.length > 0
    ) {
      if (
        (condition.includes("sunny") || condition.includes("clear")) &&
        temp > 20
      ) {
        sunIcon.forEach((icon) => (icon.style.display = "inline-block"));
        cloudIcon.forEach((icon) => (icon.style.display = "none"));
        conditionText.forEach((text) => (text.textContent = "Sunny"));
      } else if (condition.includes("cloudy")) {
        sunIcon.forEach((icon) => (icon.style.display = "none"));
        cloudIcon.forEach((icon) => (icon.style.display = "inline-block"));
        conditionText.forEach((text) => (text.textContent = "Cloudy"));
      } else if (condition.includes("partly cloudy")) {
        sunIcon.forEach((icon) => (icon.style.display = "inline-block"));
        cloudIcon.forEach((icon) => (icon.style.display = "inline-block"));
        conditionText.forEach((text) => (text.textContent = "Partly Cloudy"));
      } else if (temp < 20) {
        sunIcon.forEach((icon) => (icon.style.display = "none"));
        cloudIcon.forEach((icon) => (icon.style.display = "inline-block"));
        conditionText.forEach((text) => (text.textContent = "Cool"));
      } else {
        sunIcon.forEach((icon) => (icon.style.display = "none"));
        cloudIcon.forEach((icon) => (icon.style.display = "none"));
        conditionText.forEach((text) => (text.textContent = "Weather Unknown"));
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function fetchWeatherForecast(location) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather forecast data");
    }

    const data = await response.json();

    const tomorrow = data.forecast.forecastday[1];
    const dayAfterTomorrow = data.forecast.forecastday[2];
    tempT.textContent = tomorrow.day.avgtemp_c + "°C";
    tempC.textContent = dayAfterTomorrow.day.avgtemp_c + "°C";
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function getDayName(offset = 0) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  today.setDate(today.getDate() + offset);
  return daysOfWeek[today.getDay()];
}

const fdayO = document.getElementById("fdayO");
const fdayT = document.getElementById("fdayT");
const tDay = document.getElementById("tDay");

if (fdayO) fdayO.textContent = getDayName(0);
if (fdayT) fdayT.textContent = getDayName(1);
if (tDay) tDay.textContent = getDayName(2);

async function initializeWeather() {
  const location = await getIpAddress();
  fetchLocationData(location);
  fetchWeatherForecast(location);
}

initializeWeather();

function displayCurrentDate() {
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-GB", options);

  const dateElement = document.getElementById("currentDate");
  dateElement.textContent = formattedDate;
}

displayCurrentDate();

const searchButton = document.getElementById("searchButton");
const locationInput = document.getElementById("locationInput");

async function fetchWeatherDataByLocation(location) {
  fetchLocationData(location);
  fetchWeatherForecast(location);
}

locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const location = locationInput.value;
    if (location) {
      fetchWeatherDataByLocation(location);
    } else {
      initializeWeather();
    }
  }
});

searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    fetchWeatherDataByLocation(location);
  } else {
    initializeWeather();
  }
});
