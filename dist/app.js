const apiKey = "98cddcc8f3f3d1a4403704658bf2ec11"; // Replace with your OpenWeatherMap API key



const cityInput = document.querySelector("#cityInput");
const weatherData = document.querySelector("#weatherData");
const cardForecast = document.querySelector(".cardForecast");
const map = document.querySelector("#map");
const recentCities = document.querySelector("#recentCities");

const defaultLat = 28.632744;
const defaultLong = 77.219597;


const cityDetails = {};
// CITY SEARCH EVENT HANDLERS

//addEventListner on click for searching city
document.querySelector("#searchBtn").addEventListener("click", function() {
    const cityInput = document.querySelector("#cityInput").value.trim();
    cityDetails.cityName = cityInput;
    geoCoding(cityDetails);
    
});


// addEventListner on pressing ENTER for searching city
document.querySelector("#cityInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const cityInput = event.target.value.trim();
        cityDetails.cityName = cityInput;
        geoCoding(cityDetails);
    }
});

// addEventListener for Current location
document.querySelector("#currentLocation").addEventListener("click", function() {
    loadUserLocation();
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
        return data;

    } catch (err) {
        showErrorMessage("Error fetching weather");
        return err;
    }
};



// LOAD CURRENT LOCATION OF USER

function loadUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    const { latitude, longitude } = position.coords;
                    cityDetails.lat = latitude;
                    cityDetails.lon = longitude;
                    fetchWeatherData(cityDetails);
                    
                },
                (error) => {
                    reject(error);
                }
            )
        }
    })
}


