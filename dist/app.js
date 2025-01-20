const apiKey = "98cddcc8f3f3d1a4403704658bf2ec11";                          //OpenWeatherMap API key



const cityInput = document.querySelector("#cityInput");                     //city input
const weatherData = document.querySelector("#weatherData");                 //weather data
const cardForecast = document.querySelector(".cardForecast");               //forecast card
const map = document.querySelector("#map");                                 //map
const recentCities = document.querySelector("#recentCities");               //recent cities

const defaultLat = 28.632744;                                               //fall back to delhi
const defaultLong = 77.219597;                                              //fall back to delhi


const cityDetails = {};                                                     //city details object
// CITY SEARCH EVENT HANDLERS

window.addEventListener("DOMContentLoaded", function () {                      
    loadRecentCities();                                                     // Load recent cities from local storage
    updateRecentCitiesDropdown();                                           // Populate dropdown with recent cities
});


//addEventListner on click for searching city
document.querySelector("#searchBtn").addEventListener("click", function() {
    const cityInput = document.querySelector("#cityInput").value.trim();
    cityDetails.cityName = cityInput;
    geoCoding(cityDetails);
    saveRecentCities(cityDetails);                                          // Save to local storage    
    loadRecentCities();                                                     // Update recent cities display
});


// addEventListner on pressing ENTER for searching city
document.querySelector("#cityInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const cityInput = document.querySelector("#cityInput").value.trim();
        cityDetails.cityName = cityInput;
        geoCoding(cityDetails);
        saveRecentCities(cityDetails);                                      // Save to local storage
        loadRecentCities();                                                 // Update recent cities display
    }
});

// addEventListener for Current location
document.querySelector("#currentLocation").addEventListener("click", function() {
    loadUserLocation();
    saveRecentCities(cityDetails);                                          // Save to local storage
    });




// FETCH COORDINATES FROM THE OPEN WEATHER API (geoCodingApi)


async function geoCoding(cityDetails) {
    // console.log(cityDetails.cityName);
    try{
       const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityDetails.cityName}&limit=5&appid=${apiKey}`);
       
       const data = await response.json();
// console.log(data)
       if (data.length > 0) {
        const { lat, lon } = data[0];
        cityDetails.lat = lat;
        cityDetails.lon = lon;
// console.log(cityDetails)

        fetchWeatherData(cityDetails);
        return { lat, lon };
       }
    }catch (error) {
        return null;
    }
};



// FETCH WEATHER DATA USING OPEN WEATHER API (LATITUDE AND LONGITUDE)

async function fetchWeatherData(cityDetails) {
    
    try{
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityDetails.lat}&lon=${cityDetails.lon}&appid=${apiKey}`);
       
       const data = await response.json();
       cityDetails.weather = data;
       cityDetails.cityName = cityDetails.weather.name;
// console.log(data);

   // Update the dashboard
   updateWeatherData(cityDetails);
   updateForecast(cityDetails);
   

        return data;

    } catch (err) {
        showErrorMessage("Error fetching weather");
        return err;
    }
};



// LOAD CURRENT LOCATION OF USER


// SAVE DATA TO LOCAL STORAGE


// function to save recent cities to local storage
function saveRecentCities(cityDetails) {
    // Retrieve existing recent cities from local storage or initialize an empty array
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    
    // Check if the city is already in the list
    const isCityExists = recentCities.some(city => city.cityName === cityDetails.cityName);

    if (!isCityExists) {
        // Add the new city to the beginning of the list
        recentCities.unshift({
            cityName: cityDetails.cityName,
            lat: cityDetails.lat,
            lon: cityDetails.lon
        });

        // Limit the list to 5 cities for better usability
        if (recentCities.length > 5) {
            recentCities.pop();
        }

        // Save the updated list back to local storage
        localStorage.setItem("recentCities", JSON.stringify(recentCities));


          // Update the dropdown to reflect recent cities
    updateRecentCitiesDropdown();
    }
}


// load recent cities using addEventListner
function loadRecentCities() {
    // Retrieve recent cities from local storage
    const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    
    // Clear the existing recent cities display
    document.querySelector("#recentCities").innerHTML = "";

    // Render recent cities in the UI
    recentCities.forEach(city => {
        const cityElement = document.createElement("div");
        cityElement.classList.add("recent-city");
        cityElement.textContent = city.cityName;

        // Add an event listener to fetch weather data when clicked
        cityElement.addEventListener("click", function() {
            cityDetails.cityName = city.cityName;
            cityDetails.lat = city.lat;
            cityDetails.lon = city.lon;
            fetchWeatherData(cityDetails);
        });

        // Append the city to the recent cities container
        document.querySelector("#recentCities").appendChild(cityElement);
    });
}





// UPDATE THE DASHBOARD ANF FLOOD IT WITH DATA

function updateWeatherData(cityDetails) {
    const weatherDataSection = document.querySelector("#weatherData");
    const cityNameElement = document.querySelector("#nameOfCity");

    if (cityDetails.weather) {
        const { main, weather, wind } = cityDetails.weather;

        // Update City Name
        cityNameElement.textContent = cityDetails.cityName;

        // Update Weather Data
        weatherDataSection.innerHTML = `
            <h1 class="text-2xl font-bold">${cityDetails.cityName}</h1>
            <h2 class="text-2xl font-bold">Current Weather</h2>
            <p><strong>Temperature:</strong> ${(main.temp - 273.15).toFixed(1)}°C</p>
            <p><strong>Weather:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        `;
    } else {
        weatherDataSection.textContent = "Weather data not available.";
    }
}


function updateForecast() {
    const forecastContainer = document.querySelector("#weatherCard");

    // Replace with actual forecast data if available
    const dummyForecast = [
        { day: "Day 1", temp: 25, description: "Sunny" },
        { day: "Day 2", temp: 22, description: "Cloudy" },
        { day: "Day 3", temp: 20, description: "Rainy" },
        { day: "Day 4", temp: 26, description: "Partly Cloudy" },
        { day: "Day 5", temp: 24, description: "Clear" },
    ];

    // Clear existing forecast cards
    forecastContainer.innerHTML = "";

    // Populate forecast cards
    dummyForecast.forEach((forecast) => {
        const card = document.createElement("div");
        card.classList.add("cardForecast", "rounded-md", "bg-indigo-400", "m-2");
        card.innerHTML = `
            <p><strong>${forecast.day}</strong></p>
            <p>Temp: ${forecast.temp}°C</p>
            <p>${forecast.description}</p>
        `;
        forecastContainer.appendChild(card);
    });
}







// UPDATING DROPDOWN LIST
function updateRecentCitiesDropdown() {
    const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    const dropdown = document.querySelector("#recentCities");

    // Clear existing dropdown options
    dropdown.innerHTML = "";

    // Add a placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a Recent City";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    dropdown.appendChild(placeholderOption);

    // Add each recent city to the dropdown
    recentCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city.cityName;
        option.textContent = city.cityName;
        dropdown.appendChild(option);
    });

    // Add an event listener to fetch weather data when a city is selected
    dropdown.addEventListener("change", function () {
        const selectedCity = recentCities.find(city => city.cityName === dropdown.value);
        if (selectedCity) {
            cityDetails.cityName = selectedCity.cityName;
            cityDetails.lat = selectedCity.lat;
            cityDetails.lon = selectedCity.lon;
            fetchWeatherData(cityDetails);                                                  // Fetch and display weather data for the selected city
        }
    });
}
