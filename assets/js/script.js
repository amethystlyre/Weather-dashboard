var apiKey = "f50be9a02d66256a8b3502a7e6f70428";
var cityLocationUrl;
var cityName = "";
var countryCode = "";
var limit = "5";

var cityLat = "-37.8141705";
var cityLon = "144.965561";
var tempUnit = "metric";
var weatherData;
var searchList = [];


var userCityName = document.querySelector("#cityName");
var weatherForm = document.querySelector("#weatherForm");
var historyList = document.querySelector("#history-list");

var currentWeather = document.querySelector("#currentWeather");
var currentDetails = document.querySelector("#currentWeatherDetail");
var forecastDisplay = document.querySelector("#forecast-list");
displaySearchHistory();

weatherForm.addEventListener("submit", function (event) {
    event.preventDefault();

    resetPageData();
    if(generateLocationUrl(userCityName.value)){
        cityLocationUrl = generateLocationUrl(userCityName.value);
        updateSearchHistory(cityName, countryCode);
        displaySearchHistory();
        fetchData(cityLocationUrl);
    }    

});

function generateLocationUrl(formInput) {
    if (!formInput) {
        alert("Nothing to search for. Please enter a city name.");
        return false;
    }
    else if (formInput.includes(",")) {
        var searchString = formInput.split(",");
        cityName = searchString[0].charAt(0).toUpperCase() + searchString[0].slice(1);
        countryCode = searchString[1].toUpperCase();
        cityLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`;
        return cityLocationUrl;
    }
    else {
        cityName = formInput.charAt(0).toUpperCase() + formInput.slice(1);
        countryCode = "";
        cityLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
        return cityLocationUrl;
    }
}


function fetchData(url) {
    fetch(url)
        .then(
            function (response) {
                if (response.ok) {
                    console.log(response.statusText);
                    response.json()
                        .then(locationData => getWeatherData(locationData))
                }
                else {
                    alert("Error fetching location data: " + response.statusText);
                    console.log(response.statusText);
                }
            })
        .catch((error) => {
            console.error(error);
            alert("Error on location API call");
        });
}


function getWeatherData(data) {
    console.log(data);
    cityLat = data[1].lat;
    console.log("lat: " + cityLat);
    cityLon = data[1].lon;
    console.log("lon: " + cityLon);
    cityCountry = data[1].country;
    console.log("Country: " + cityCountry);

    let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${tempUnit}&appid=${apiKey}`;
    fetch(weatherURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response.statusText);
                response.json()
                    .then(weatherData => processWeatherData(weatherData))
            }
            else {
                alert("Error fetching weather data: " + response.statusText);
                console.log(response.statusText);
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Error on weather API call");
        });
}


function processWeatherData(data) {
    weatherData = data.list
    //console.log(weatherData[0]);
    let forecastData = [];

    renderCurrentWeather(weatherData[0]);
    for (let i = 1; i < 6; i++) {
        let forecast = dayjs().add(i, "day").format("YYYY-MM-DD");
        //console.log(forecast);
        let firstRecord = weatherData.find((element) => element.dt_txt.slice(0, 10) == forecast)
        //console.log("found: "+JSON.stringify(found));
        forecastData.push(firstRecord);
    }
    //console.log(forecastData);
    renderForecastWeather(forecastData);

}

function renderCurrentWeather(currentWeatherObject) {
    let date = currentWeatherObject.dt_txt.slice(0, 10);
    let displayDateFormat = dayjs(date).format("DD/MM/YYYY");
    //console.log(date);

    let weatherDes = currentWeatherObject.weather["0"].description;

    let icon = currentWeatherObject.weather["0"].icon;
    //console.log(icon);

    currentWeather.textContent = `${cityName}, ${countryCode} (${displayDateFormat})`;
    var image = document.createElement("img");
    image.setAttribute("src", `https://openweathermap.org/img/wn/${icon}.png`);
    image.setAttribute("alt", weatherDes);
    currentWeather.appendChild(image);

    let temp = currentWeatherObject.main.temp //metrics measurement: C degrees
    //console.log(temp);
    let tempEl = document.createElement("p");
    tempEl.textContent = `Temperature: ${temp}℃ degrees`;
    currentDetails.appendChild(tempEl);

    let humidity = currentWeatherObject.main.humidity //metrics measurement: %
    //console.log(humidity);
    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${humidity}%`;
    currentDetails.appendChild(humidityEl);

    let wind = currentWeatherObject.wind.speed//metrics measurement: meter/sec
    //console.log(wind);
    let windEl = document.createElement("p");
    windEl.textContent = `Wind speed: ${wind} meters/sec`;
    currentDetails.appendChild(windEl);
}

function renderForecastWeather(forecastDataList) {

    for (let i = 0; i < forecastDataList.length; i++) {

        let divCol = document.createElement("div");
        divCol.setAttribute("class", "col");
        let divCard = document.createElement("div");
        divCard.setAttribute("class", "card customCard");


        let date = forecastDataList[i].dt_txt.slice(0, 10);
        let displayDateFormat = dayjs(date).format("DD/MM/YYYY");
        //console.log(date);

        let weatherDes = forecastDataList[i].weather["0"].description;

        let icon = forecastDataList[i].weather["0"].icon;
        //console.log(icon);
        let dateHead = document.createElement("h4");
        dateHead.textContent = displayDateFormat;
        divCard.appendChild(dateHead);

        let image = document.createElement("img");
        image.setAttribute("src", `https://openweathermap.org/img/wn/${icon}.png`);
        image.setAttribute("alt", weatherDes);
        divCard.appendChild(image);

        let temp = forecastDataList[i].main.temp //metrics measurement: C degrees
        //console.log(temp);
        let tempEl = document.createElement("p");
        tempEl.textContent = `Temperature: ${temp}℃ degrees`;
        divCard.appendChild(tempEl);

        let humidity = forecastDataList[i].main.humidity //metrics measurement: %
        //console.log(humidity);
        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${humidity}%`;
        divCard.appendChild(humidityEl);

        let wind = forecastDataList[i].wind.speed//metrics measurement: meter/sec
        //console.log(wind);
        let windEl = document.createElement("p");
        windEl.textContent = `Wind speed: ${wind} meters/sec`;
        divCard.appendChild(windEl);

        divCol.appendChild(divCard);
        forecastDisplay.appendChild(divCol);
    }
}

//function for checking local storage for previous saved records
function checkSearchHistory() {
    if (localStorage.hasOwnProperty("searchList")) {
        return searchList = JSON.parse(localStorage.getItem("searchList"));
    }
    else {
        return searchList = [];
    }
}

function updateSearchHistory(cityName, countryCode) {
    const MAX_LENGTH = 5;

    let userSearch = {
        city: cityName,
        country: countryCode
    }

    checkSearchHistory();
    let findRecordIndex = searchList.findIndex(
        function (record) {
            if (record.city == cityName && record.country == countryCode)
            {return true;}
        });
    if (findRecordIndex == -1 && searchList.length < MAX_LENGTH) {
        searchList.unshift(userSearch);
    }
    else if (findRecordIndex == -1 && searchList.length == MAX_LENGTH) {
        searchList.pop();
        searchList.unshift(userSearch);
    }
    else {
        searchList.splice(findRecordIndex, 1);
        searchList.unshift(userSearch);
    }
    localStorage.setItem("searchList", JSON.stringify(searchList));

}

function displaySearchHistory() {

    checkSearchHistory();
    for (let city in searchList) {
        let searchButton = document.createElement("button");
        searchButton.setAttribute("type", "button");
        searchButton.setAttribute("class", "custombtn");
        searchButton.textContent = `${searchList[city].city}, ${searchList[city].country}`;
        historyList.appendChild(searchButton);
    }
}



function resetPageData() {
    currentDetails.innerHTML = "";
    historyList.innerHTML = "";
    forecastDisplay.innerHTML="";
}

