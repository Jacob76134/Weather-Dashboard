
var citiesList = document.querySelector("#citiesList")
var citySearch = document.querySelector("#citySearch")
var citySubmit = document.querySelector("#citySubmit")
var cityName = document.querySelector("#cityName")
var cityTemp = document.querySelector("#cityTemp")
var cityWind = document.querySelector("#cityWind")
var cityHumid = document.querySelector("#cityHumidity")
var cityUV = document.querySelector("#uvIndex")
var weatherImage = document.querySelector("#weatherImage")
var currentTemp = document.querySelector("#temperature")
var forecastList = document.querySelector(".forecastList")
var clearSearch = document.querySelector(".clearSearch")

// require('dotenv').config()

var dataCurrent;
var dataForecast = [];

var cityText = "";


var urlCurrent = "";
var urlForecast = "";

var cities = [];

function renderCities(){

    citiesList.innerHTML = ""

    for (let i = 0; i < cities.length; i++) {
        
        let city = cities[i];

        var li = document.createElement('li');

        li.innerHTML = city;

        citiesList.appendChild(li);

        // Clicking on a history item
        li.addEventListener("click", (event) => {
            cityText = event.target.innerText;

            if(cities.includes(cityText)){
                cities = cities.filter(city => city !== cityText);
            }
    
            cities.push(cityText);

            citySearch.value = cityText;
    
            //Weather 
            storeCities();
            renderCities();
            renderCurrentWeather();
        })
    }
}

function storeCities() {
    
    localStorage.setItem("cities", JSON.stringify(cities));
}

function renderCurrentWeather(){

    var lat = 0;
    var lon = 0;

    fetch(`/api?q=${cityText}`)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        // If we get status 200
        if(data.current.cod === 200){
            lat = data.lat;
            lon = data.lon;


            // Current

            dataCurrent = data.current;
            cityName.textContent = dataCurrent.name;

            weatherImage.src = `https://openweathermap.org/img/wn/${dataCurrent.weather[0].icon}@2x.png`
            currentTemp.textContent = Math.floor(dataCurrent.main.temp) + "° F";
            cityTemp.textContent = "Feels like " + dataCurrent.main.feels_like + "° F";
            cityWind.textContent = dataCurrent.wind.speed + " mph Winds";
            cityHumid.textContent = dataCurrent.main.humidity + "% Humidity";

            // Forecast

            // Clear the list
            forecastList.innerHTML = "";

            for (let i = 0; i < 5; i++) {
                
                let forecastData = data.forecast[i];

                let date = new Date(forecastData.dt * 1000);
                let dayOfTheWeek = "";

                switch (date.getDay()) {
                    case 0:
                        dayOfTheWeek = 'Monday';
                        break;
                    case 1:
                        dayOfTheWeek = 'Tuesday';
                        break;
                    case 2:
                        dayOfTheWeek = 'Wednesday';
                        break;
                    case 3:
                        dayOfTheWeek = 'Thursday';
                        break;
                    case 4:
                        dayOfTheWeek = 'Friday';
                        break;
                    case 5:
                        dayOfTheWeek = 'Saturday';
                        break;
                    case 6:
                        dayOfTheWeek = 'Sunday';
                        break;
                        
                        default:
                            dayOfTheWeek = 'Unknown';
                            break;
                        }
                        

                let parsedTitle = "<div class='forecast-title'><h3>" + dayOfTheWeek + "</h3>" + (date.getMonth() + 1) + "/" + (date.getDate() + 1) + "/" + date.getFullYear() + "</div>";
                
                let el = document.createElement("div");

                el.classList.add("forecastItem");
                el.innerHTML = parsedTitle + 
                `
                <div class="forecast-weather">
                <span class="forecast-temp">${forecastData.temp.day}° F</span>
                <img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png"/>
                </div>
                <p>Wind: ${forecastData.wind_speed} mph</p>
                <p>Humidity: ${forecastData.humidity}%</p>
                `;

                forecastList.appendChild(el);
            }

            let uvi = data.forecast[0].uvi;
            // Set the UV Index
            cityUV.innerHTML = "UV Index: <span>" + uvi + "</span>";

            let uvClass = "";

            if(0 <= uvi && uvi < 3){
                uvClass = 'low';
            }else if(3 <= uvi && uvi < 6){
                uvClass = 'moderate';
            }else if(6 <= uvi && uvi < 8){
                uvClass = 'high';
            }else if(8 <= uvi && uvi < 11){
                uvClass = 'very-high';
            }else{
                uvClass = 'extreme';
            }

            cityUV.className = ""; // Clear the classes on the element
            cityUV.classList.add(uvClass); // Add the class that corresponds to the uvi

            }else{
                cities.filter(city => city !== cityText);
                renderCities();
            }
    })
}


citySubmit.addEventListener("click", (event) => {
        event.preventDefault();
        
        cityText = citySearch.value.trim();

        if (cityText === "") {
            return;
        // Remove history that matches our current search
        }else if(cities.includes(cityText)){
            cities = cities.filter(city => city !== cityText);
        }

        cities.push(cityText);
        

        //Weather 
        storeCities();
        renderCities();
        renderCurrentWeather();

    }); 


function init() {

    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities !== null) {
        
        cities = storedCities;
    }

    renderCities();
}

clearSearch.addEventListener("click", (event) => {
    event.preventDefault();

     cities = [];

     storeCities();
     renderCities();
});

init();

