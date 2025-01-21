const apiKey = "98cddcc8f3f3d1a4403704658bf2ec11"; // Replace with your OpenWeatherMap API key
const iconBaseUrl = "http://openweathermap.org/img/wn/"; // Icon base URL

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocation");
const recentCities = document.getElementById("recentCities");
const weatherData = document.getElementById("weatherData");




const defaultLat = 28.632744;                                               //fall back to delhi
const defaultLong = 77.219597;                                              //fall back to delhi

// _________________________________________________________________________________________________________________________________
//EVENT HANDLERS
// _________________________________________________________________________________________________________________________________

// Call the function to load recent cities on page load
document.addEventListener("DOMContentLoaded", () => {
   fetchWeatherData(defaultLat, defaultLong);
   dropDownRecentCities();
}
);

// Search button event for weather data
searchBtn.onclick = () => {
   cityInput.value;
   console.log(cityInput.value);
   geoCoding(cityInput.value);
   dropDownRecentCities();

};

// Enter key event for weather data
cityInput.addEventListener("keydown", function (event) {
   if (event.key === "Enter") {
      cityInput.value;
      console.log(cityInput.value);
      geoCoding(cityInput.value);
      dropDownRecentCities();

   }
});

// Load weather data when selecting any recent city
recentCities.addEventListener("change", function () {
   const selectedCity = recentCities.value;
   if (selectedCity) {
      const recentCitiesDetails = JSON.parse(localStorage.getItem("recentCities")) || [];
      const cityDetails = recentCitiesDetails.find(city => city.city.name === selectedCity);
      if (cityDetails) {
         updateWeatherData(cityDetails);
         forecastData(cityDetails.city.coord.lat, cityDetails.city.coord.lon);
      }
   }
});

// _________________________________________________________________________________________________________________________________
//FETCH COORDINATE, CURRENT LOCATION, WEATHER DATA, FORECAST DATA
// _________________________________________________________________________________________________________________________________

// GET CURRENT LOCATION DATA USING GEOLOCATION API
currentLocationBtn.onclick = () => {
   navigator.geolocation.getCurrentPosition((position) => {
      console.log("CURRENT LOCATION DATA", position);              //CONSOLE LOGGING THE DATA

      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      fetchWeatherData(latitude, longitude);
   });
}

// FETCH COORDINATES FROM THE OPEN WEATHER API (geoCodingApi)
async function geoCoding(cityName) {

   try {
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`);

      const data = await response.json();
      console.log("COORDINATES DATA", data);                 //CONSOLE LOGGING THE DATA

      if (data.length > 0) {
         const { lat, lon } = data[0];
         fetchWeatherData(lat, lon);
         return { lat, lon };
      }
      else {
         console.log("No data found! Please enter correct city name");
         fetchWeatherData(defaultLat, defaultLong);
      }
   } catch (error) {
      console.log(error);
   }
};

// FETCH WEATHER DATA USING OPEN WEATHER API (LATITUDE AND LONGITUDE)
async function fetchWeatherData(lat, lon) {
   try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();
      const aqiResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const aqiData = await aqiResponse.json();
      // console.log("AQI DATA", aqiData); // Console logging the data
      data.AQIdata = aqiData;
      // console.log("WEATHER DATA", data);                              //CONSOLE LOGGING THE DATA

      forecastData(lat, lon);

      saveRecentCities(data);
      updateWeatherData(data);
      return data;
   } catch (error) {
      console.log(error);
   }
}

// FETCH FORECAST DATA USING OPEN WEATHER API (LATITUDE AND LONGITUDE)
async function forecastData(lat, lon) {
   try {
      try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`);
         const data = await response.json();
         // console.log("FORECAST DATA", data);                             //CONSOLE LOGGING THE DATA

         forecastCards(data);

         return data;
      } catch (error) {
         console.log(error);
      }

   } catch (error) {
      console.log(error);
   }
};

// _________________________________________________________________________________________________________________________________
//LOCAL STORAGE FUNCTIONS
// _________________________________________________________________________________________________________________________________

// save recent cities to local storage
function saveRecentCities(cityDetails) {
   let recentCitiesDetails = JSON.parse(localStorage.getItem("recentCities")) || [];
   const isCityExists = recentCitiesDetails.some(element => element.city.name === cityDetails.city.name);

   if (!isCityExists) {
      recentCitiesDetails.unshift(cityDetails);
      if (recentCitiesDetails.length > 5) {
         recentCitiesDetails.pop();
      }
      localStorage.setItem("recentCities", JSON.stringify(recentCitiesDetails));
   }

}

// _________________________________________________________________________________________________________________________________
//DOM MANIPULATION
// _________________________________________________________________________________________________________________________________

// Update weather data
function updateWeatherData(weatherDetails) {
   const icon = weatherDetails.list[0].weather[0].icon;
   const tempCelsius = (weatherDetails.list[0].main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius
   const dateTime = new Date().toLocaleString(); // Get current date and time

   weatherData.innerHTML = `
   <div class="card max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
      <div class="icon p-4 bg-blue-500 flex-shrink-0">
         <img class="w-30 h-30 mx-auto" src="${iconBaseUrl}${icon}@2x.png" alt="Weather icon">
      </div>
      <div class="card-body p-6 flex-grow">
         <h3 class="card-title text-5xl font-semibold text-gray-800">${weatherDetails.city.name}, ${weatherDetails.city.country}</h3>
         <div class="flex flex-col md:grid-cols-2 gap-2 justify-between mt-2">
         <p class="card-text text-blue-600 font-black text-3xl">Temperature: ${tempCelsius}°C</p>
            <p class="card-text text-gray-600 capitalize font-medium text-xl">${weatherDetails.list[0].weather[0].description}</p>
            <p class="card-text text-green-500 font-medium text-xl">Humidity: ${weatherDetails.list[0].main.humidity}%</p>
            <p class="card-text text-blue-400 font-medium text-xl">Wind Speed: ${weatherDetails.list[0].wind.speed} m/s</p>
            <p class="card-text text-gray-600 font-medium text-xl">Date & Time: ${dateTime}</p>
         </div>
      </div>
   </div>`;


   document.getElementById("aqi").innerHTML = `
   <div class="card max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-4">
      <div class="p-4 bg-red-500 text-white">
         <h3 class="text-xl font-semibold">Air Quality Index (AQI)</h3>
         <p class="text-2xl">${weatherDetails.AQIdata.list[0].main.aqi}</p>
      </div>
      <div class="p-6">
         <h4 class="text-xl font-semibold mb-2">Components</h4>
         <div class="grid grid-cols-2 gap-4">
            <p class="text-gray-600"><strong>CO :</strong> ${weatherDetails.AQIdata.list[0].components.co}</p>
            <p class="text-gray-600"><strong>NH<sub>3</sub> :</strong> ${weatherDetails.AQIdata.list[0].components.nh3}</p>
            <p class="text-gray-600"><strong>NO :</strong> ${weatherDetails.AQIdata.list[0].components.no}</p>
            <p class="text-gray-600"><strong>NO<sub>2</sub> :</strong> ${weatherDetails.AQIdata.list[0].components.no2}</p>
            <p class="text-gray-600"><strong>O<sub>3</sub> :</strong> ${weatherDetails.AQIdata.list[0].components.o3}</p>
            <p class="text-gray-600"><strong>PM 2.5 :</strong> ${weatherDetails.AQIdata.list[0].components.pm2_5}</p>
            <p class="text-gray-600"><strong>PM 10 :</strong> ${weatherDetails.AQIdata.list[0].components.pm10}</p>
            <p class="text-gray-600"><strong>SO<sub>2</sub> :</strong> ${weatherDetails.AQIdata.list[0].components.so2}</p>
         </div>
      </div>
   </div>`;

}

// Forecast cards
function forecastCards(forecastDetails) {
   const forecastHTML = forecastDetails.list.slice(0, 5).map((day, index) => {
      const date = new Date(day.dt * 1000).toLocaleDateString();
      const tempCelsius = (day.temp.day - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius
      const icon = day.weather[0].icon;
      return `
         <div class="card bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-4 bg-blue-500 text-white">
               <h4 class="text-xl font-semibold">Day ${index + 1} (${date})</h4>
               <img class="w-10 h-10 mx-auto" src="${iconBaseUrl}${icon}@2x.png" alt="Weather icon">
            </div>
            <div class="p-6">
               <p class="text-gray-600 text-lg"><strong>Temperature:</strong> ${tempCelsius}°C</p>
               <p class="text-gray-600 text-lg"><strong>Humidity:</strong> ${day.humidity}%</p>
               <p class="text-gray-600 text-lg"><strong>Wind Speed:</strong> ${day.speed} m/s</p>
            </div>
         </div>`;
   }).join('');

   document.getElementById("weatherCards").innerHTML = `
      <div class="card max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-4">
         <div class="p-4 bg-blue-500 text-white">
            <h3 class="text-xl font-semibold">5-Day Weather Forecast</h3>
         </div>
         <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${forecastHTML}
         </div>
      </div>`;
}

//drop down for recent cities
function dropDownRecentCities() {
   let recentCitiesDetails = JSON.parse(localStorage.getItem("recentCities")) || [];
   const dropDownHTML = recentCitiesDetails.map(city => {
      return `<option value="${city.city.name}">${city.city.name}</option>`;
   }).join('');

   recentCities.innerHTML = dropDownHTML;
}











