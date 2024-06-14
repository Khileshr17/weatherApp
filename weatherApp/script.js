const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "7c8941a9de5c0e3cb831e7217c56e9cb";

const createWeatherCard = (cityNames,weatherItem,index) => {
    if(index ===  0){
        return `<div class="details">
        <h2>${cityNames} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h6>${weatherItem.weather[0].description}</h6>
    </div>`;
    }
    else{
        return `<li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </li>`;

    }
};
const getWeatherDetails = (cityNames, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const uniqueForcastDays = [];
            const fiveDaysForcaste = data.list.filter((forcast) => {
                const forecastDate = new Date(forcast.dt_txt).getDate();
                if (!uniqueForcastDays.includes(forecastDate)) {
                    return uniqueForcastDays.push(forecastDate);
                }
            });
            cityInput.value  = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";
            console.log(fiveDaysForcaste);
            fiveDaysForcaste.forEach((weatherItem ,index) => {
               if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",
                    createWeatherCard(cityNames,weatherItem,index));
               }
               else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",
                    createWeatherCard(cityNames,weatherItem,index));
               }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
const geoCityCoordinates = () => {
    const cityNames = cityInput.value.trim();
    if (!cityNames) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityNames}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            if (!data.length) return alert(`no coordinates found at ${cityNames}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("Somethin went Wrong");
        });
};
const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude , longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
            fetch(REVERSE_GEOCODING_URL)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            if (!data.length) return alert(`no coordinates found at ${cityNames}`);
            const { name } = data[0];
            getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
            alert("Somethin went Wrong");
        });
            // console.log(position);
        },
        error =>{
            if(error.code  === error.PERMISSION_DENIED){
                alert("PERMISSION DENIED! Please grant permission")
            }
        }
    )
}
locationButton.addEventListener("click", getUserCoordinates)
searchButton.addEventListener("click", geoCityCoordinates);
