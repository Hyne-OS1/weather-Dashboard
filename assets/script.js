// custom API key from openweathermap
var APIKey = "f284053e3fcd6de45c072549a69f7161"; 

//search button variable
var searchBtn = document.querySelector(".search-btn");

//variable for 5 day weather cards attatched to conditions card section of HTML
var weatherCardsInfo = document.querySelector(".conditions-cards");

//variable for 5 day weather conditions linked to html
var newWeatherCard = (weatherCondition) => {
    return ` <li class="card">
            <h3>(${weatherCondition.dt_txt.split(" ")[0]})</h3>
             <img src="https://openweathermap.org/img/wn/${weatherCondition.weather[0].icon}@2x.png" alt="weather-icon">
             <h4>Temp: ${(weatherCondition.main.temp - 273.15).toFixed(2)}c</h4>
            <h4>Wind: ${weatherCondition.wind.speed}km/h</h4>
            <h4>Humidity: ${weatherCondition.main.humidity}%</h4>
            </li>`;
}


var weatherinfo = (cityName, lat, lon) => {
    var weatherApi = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

    //fetch weather api command + five day forecast console log filter
    fetch(weatherApi)
        .then(res => res.json())
        .then(data => {

         var forecastDays = [];
            var fiveDayFilter = data.list.filter(forecast => {
            var forecastTime = new Date(forecast.dt_txt).getDate();
            if (!forecastDays.includes(forecastTime)) {
               return forecastDays.push(forecastTime);
            }
        });

        //gets rid of blank HTML card placeholders
        cityName.value = "";
        weatherCardsInfo.innerHTML = "";

        //what will show in the console for five day conditions
        console.log(fiveDayFilter);
        fiveDayFilter.forEach(weatherCondition => {
            weatherCardsInfo.insertAdjacentHTML("beforeend", newWeatherCard(weatherCondition));
        });
    }).catch(() => {
            alert("error: cannot fetch weather conditions");
        });
};

//running dom content just makes sure java only runs after all the HTML has been loaded
document.addEventListener("DOMContentLoaded", function () {
    var searchBtn = document.querySelector(".search-btn");
    var enterCity = document.querySelector(".city-name");
    weatherCardsInfo = document.querySelector(".conditions-cards");

//variable for city search and event listener to show console commands and Api Function 
    var cityLocation = () => {
        var cityName = enterCity.value.trim();
        if (!cityName) return;
        var geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    // API city code response using longitude latitude and city name 
        fetch(geocodingUrl)
            .then(res => res.json())
            .then(data => {
                if (!data.length) return alert(`error: location not found for ${cityName}`);
                var { name, lat, lon } = data[0];
                weatherinfo(name, lat, lon);
            })
            .catch(() => {
                alert("error: Website could not retrieve city location");
            });
    };

//event listener of click function for city search
    searchBtn.addEventListener("click", cityLocation);
});