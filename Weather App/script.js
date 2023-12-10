const API_KEY = "0c912f95135cb188a46c78cc1b3dc730";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
let weatherTable = document.getElementById("weatherTable");

async function getWeatherByLocation(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const resp = await fetch(apiUrl);

    if (!resp.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await resp.json();
    console.log(weatherData);

    addWeatherToPage(weatherData); // Pass weatherData to the next function
  } catch (error) {
    console.error("There was a problem fetching weather data:", error.message);
  }
}

function addWeatherToPage(weatherData) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const newWeatherTable = document.createElement("table");
  const tableBody = document.createElement("tbody");

  const currentDate = new Date();
  let dayCounter = 0;

  const list = weatherData.list;

  for (let i = 0; i < 5; i++) {
    // Loop through the next 5 days (adjust as needed)
    const row = tableBody.insertRow();
    for (let j = 0; j < 7; j++) {
      const cell = row.insertCell();
      const targetDate = new Date();
      targetDate.setDate(currentDate.getDate() + dayCounter);

      const weatherInfo = list.find((item) => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.getDate() === targetDate.getDate();
      });

      if (weatherInfo && weatherInfo.main.temp !== undefined) {
        const weatherDetails = `${weatherInfo.weather[0].main}, ${weatherInfo.main.temp}°C`;
        const iconUrl = `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`;
        content = `<b>${
          weekdays[targetDate.getDay()]
        }</b><br>${targetDate.toDateString()}<br>${weatherDetails}<br><img src="${iconUrl}" alt="Weather Icon">`;
      } else {
        const temp = "N/A";
        content = `<b>${
          weekdays[targetDate.getDay()]
        }</b><br>${targetDate.toDateString()}<br>Temp: ${temp}`;
      }

      cell.innerHTML = `<div class="cell-content">${content}</div>`;
      dayCounter++;
    }
  }

  newWeatherTable.appendChild(tableBody);
  main.appendChild(newWeatherTable);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const city = search.value.trim();

  if (city) {
    getWeatherByLocation(city);
  } else {
    console.error("Please enter a valid city name");
  }
});
