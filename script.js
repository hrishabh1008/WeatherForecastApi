const apiKey = "98cddcc8f3f3d1a4403704658bf2ec11"; // Replace with your OpenWeatherMap API key


const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocation");
const recentCities = document.getElementById("recentCities");
const weatherData = document.getElementById("weatherData");
const cardForecast = document.getElementsByClassName("cardForecast");



const defaultLat = 28.632744;                                               //fall back to delhi
const defaultLong = 77.219597;                                              //fall back to delhi




// Search button event for weather data
searchBtn.onclick = () => {
   cityInput.value;
   console.log(cityInput.value);
   geoCoding(cityInput.value);
      };

      // Enter key event for weather data
cityInput.addEventListener("keydown", function(event) {
   if (event.key === "Enter") {
      cityInput.value;
      console.log(cityInput.value);
      geoCoding(cityInput.value);    
                                           
      }
   });
     













  // GET CURRENT LOCATION DATA USING GEOLOCATION API
   currentLocationBtn.onclick = () => {
      navigator.geolocation.getCurrentPosition((position) => {
         console.log("CURRENT LOCATION DATA",position);              //CONSOLE LOGGING THE DATA
         
         const {latitude, longitude} = position.coords; 
         console.log(latitude, longitude);
         fetchWeatherData(latitude, longitude);
      });
   }




// FETCH COORDINATES FROM THE OPEN WEATHER API (geoCodingApi)
      async function geoCoding(cityName) {
       
         try{
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`);
            
              const data = await response.json();
               console.log("COORDINATES DATA",data);              //CONSOLE LOGGING THE DATA
               
            if (data.length > 0) {
             const { lat, lon } = data[0];
             fetchWeatherData(lat, lon);
             return { lat, lon };
            }
            else{
               console.log("No data found! Please enter correct city name");
               fetchWeatherData(defaultLat, defaultLong);
            }
         }catch (error) {
            console.log(error);
         }
     };




// FETCH WEATHER DATA USING OPEN WEATHER API (LATITUDE AND LONGITUDE)
async function fetchWeatherData(lat, lon) {
   try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();
      console.log("WEATHER DATA",data);                         //CONSOLE LOGGING THE DATA
      forecastData(lat, lon);

      
      
      return data;
   }catch (error){
      console.log(error);
   }
}



// FETCH FORECAST DATA USING OPEN WEATHER API (LATITUDE AND LONGITUDE)
async function forecastData(lat, lon){
try {
   try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`);
      const data = await response.json();
      console.log("FORECAST DATA",data);                        //CONSOLE LOGGING THE DATA
   }catch(error){
      console.log(error);
   }
} catch (error) {
   console.log(error);
}
};








