
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

// const dotenv = require('dotenv').config()


var dataCurrent;
var dataForecast = [];

var cityText = "";


const apiKey = process.env.API_KEY;


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

            console.log(event);
        })
    }
}

function storeCities() {
    
    localStorage.setItem("cities", JSON.stringify(cities));
}

function renderCurrentWeather(){

    var lat = 0;
    var lon = 0;

    urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityText + "&Appid=" + apiKey + "&units=imperial";

    fetch(urlCurrent)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        // If we get status 200
        if(data.cod === 200){
            lat = data.coord.lat;
            lon = data.coord.lon;
            dataCurrent = data;

            cityName.textContent = data.name;

            // var cityIcon = document.createElement("img");
            weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            // cityName.append(cityIcon);
            currentTemp.textContent = Math.floor(data.main.temp, 0) + "° F";
            cityTemp.textContent = "Feels like " + data.main.feels_like + "° F";
            cityWind.textContent = data.wind.speed + " mph Winds";
            cityHumid.textContent = data.main.humidity + "% Humidity";


            // console.log(dataCurrent);
            renderForecast(lat, lon);
        }else{
            console.log("We got here");
            cities.filter(city => city !== cityText);
            renderCities();
        }
    })
}

function renderForecast(lat, lon){

    urlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&Appid=" + apiKey + "&exclude=minutely,hourly&units=imperial";

    fetch(urlForecast).then(function (response){
        return response.json();
    }).then(function (data) {

        // Clear the list
        forecastList.innerHTML = "";

        for (let i = 0; i < 5; i++) {
            
            let forecastData = data.daily[i];

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
        } // End For

        let uvi = data.current.uvi;
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

        dataForecast 
        // console.log(dataForecast);
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

