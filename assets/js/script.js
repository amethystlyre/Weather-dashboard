// Initialize global variables
var apiKey = "f50be9a02d66256a8b3502a7e6f70428"; //f50be9a02d66256a8b3502a7e6f70428
var cityLocationUrl;
var cityName;
var countryCode;
var countryFound;
var limit = "5";

var cityLat;
var cityLon;
var tempUnit = "metric";
var weatherData;
var searchList = [];

//Assign HTML element to variables
var userCityName = document.querySelector("#cityName");
var weatherForm = document.querySelector("#weatherForm");
var searchHistory = document.querySelector("#history-list");

var currentWeather = document.querySelector("#currentWeather");
var currentDetails = document.querySelector("#currentWeatherDetail");
var forecastDisplay = document.querySelector("#forecast-list");

//Display past user searches
displaySearchHistory();

//Listen to form submission
weatherForm.addEventListener("submit", formSubmissionHandler);

//Handle form submission from user input
function formSubmissionHandler(event) {
    event.preventDefault();

    resetPageData();
    if (generateLocationUrl(userCityName.value)) {
        cityLocationUrl = generateLocationUrl(userCityName.value);
        updateSearchHistory(cityName, countryCode);
        displaySearchHistory();
        fetchLocationData(cityLocationUrl);
    }
}

//Listen for button clicks on past weather search
searchHistory.addEventListener("click", buttonClickHandler);

//Handle button clicks from user
function buttonClickHandler(event) {
    event.preventDefault();
    resetPageData();

    cityName = event.target.dataset.city;
    countryCode = event.target.dataset.country;

    if (!countryCode) {
        cityLocationUrl = generateLocationUrl(cityName);
    }
    else {
        cityLocationUrl = generateLocationUrl(cityName + "," + countryCode);
    }
    updateSearchHistory(cityName, countryCode);
    displaySearchHistory();
    fetchLocationData(cityLocationUrl);
}


//Function for generating URL used in Geocoding API call
//Find coordinates by city name and country code
function generateLocationUrl(formInput) {
    if (!formInput) {
        return false;
    }
    else if (formInput.includes(",")) {
        var searchString = formInput.split(",");
        cityName = searchString[0].charAt(0).toUpperCase() + searchString[0].slice(1);
        countryCode = searchString[1].toUpperCase();
        cityLocationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`;
        return cityLocationUrl;
    }
    else {
        cityName = formInput.charAt(0).toUpperCase() + formInput.slice(1);
        countryCode = "";
        cityLocationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
        return cityLocationUrl;
    }
}

//Function for fetching city coordinates data given cityLocationUrl
function fetchLocationData(url) {
    fetch(url)
        .then(
            function (response) {
                if (response.ok) {
                    //console.log(response);
                    response.json()
                        .then(locationData => getWeatherData(locationData))
                }
                else {
                    alert("Error fetching location data: " + response.statusText);
                }
            })
        .catch((error) => {
            console.error(error);
            alert("Error on location API call");
        });
}

//Extract coordinates based on the Geocoding API response to build URL for "5 day weather forecast" API call
function getWeatherData(data) {
    //check if the response data is not empty
    if (data.length == 0) {
        alert("No location data found");
        return;
    }

    cityLat = data[0].lat;
    cityLon = data[0].lon;
    countryFound = data[0].country;

    let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${tempUnit}&appid=${apiKey}`;

    //start fetching weather data
    fetch(weatherURL)
        .then(function (response) {
            if (response.ok) {
                //console.log(response.statusText);
                response.json()
                    .then(weatherData => processWeatherData(weatherData))
            }
            else {
                alert("Error fetching weather data: " + response.statusText);
                //console.log(response.statusText);
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Error on weather API call");
        });
}

//Function for processing the weather data list received
function processWeatherData(data) {
    //check if the weather data returned from API is empty
    if (data.length == 0 || data.list.length == 0) {
        alert("No weather data found");
        return;
    }

    weatherData = data.list //should return 40 objects in array list
    //find first object in the data list that relates to today's weather in case data not up to date
    let todayData = weatherData.find((element) => dayjs.unix(element.dt).format("DD/MM/YYYY") == dayjs().format("DD/MM/YYYY"));
    renderCurrentWeather(todayData);

    //find the first record for each consequtive day in the future
    let forecastData = [];
    for (let i = 1; i < 6; i++) {
        let forecast = dayjs().add(i, "day").format("DD/MM/YYYY");
        let firstRecord = weatherData.find((element) => dayjs.unix(element.dt).format("DD/MM/YYYY") == forecast);
        if (firstRecord) {
            forecastData.push(firstRecord);
        }
    }
    renderForecastWeather(forecastData);
}

//Function for displaying current weather details on page
function renderCurrentWeather(currentWeatherObject) {
    let date = currentWeatherObject.dt;
    let displayDateFormat = dayjs.unix(date).format("DD/MM/YYYY");

    if (!countryCode) {
        currentWeather.textContent = `${cityName}, ${countryFound} (${displayDateFormat})`;
    } else {
        currentWeather.textContent = `${cityName}, ${countryCode} (${displayDateFormat})`;
    }

    let icon = currentWeatherObject.weather["0"].icon;
    let weatherDes = currentWeatherObject.weather["0"].description;
    createImgElement(icon, weatherDes, currentWeather);
    
    createTempElement(currentWeatherObject.main.temp, currentDetails);
    createHumElement(currentWeatherObject.main.humidity, currentDetails);
    createWindElement(currentWeatherObject.wind.speed, currentDetails);

}

//Function for displaying forecast weather details on page
function renderForecastWeather(forecastDataList) {

    for (let i = 0; i < forecastDataList.length; i++) {

        let divCol = document.createElement("div");
        divCol.setAttribute("class", "col my-2");
        let divCard = document.createElement("div");
        divCard.setAttribute("class", "card customCard");

        let date = forecastDataList[i].dt;
        let displayDateFormat = dayjs.unix(date).format("DD/MM/YYYY");
        let dateHead = document.createElement("h4");
        dateHead.textContent = displayDateFormat;
        divCard.appendChild(dateHead);

        let weatherDes = forecastDataList[i].weather["0"].description;
        let icon = forecastDataList[i].weather["0"].icon;
        createImgElement(icon, weatherDes, divCard);

        createTempElement(forecastDataList[i].main.temp, divCard);

        createHumElement(forecastDataList[i].main.humidity, divCard);

        createWindElement(forecastDataList[i].wind.speed, divCard);

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

//function for updating local storage after user makes search submission
function updateSearchHistory(cityName, countryCode) {

    //Maximum history lenth saved for user
    const MAX_LENGTH = 8;

    let userSearch = {
        city: cityName,
        country: countryCode
    }

    checkSearchHistory();

    //Look in search history to see user has already searched for this location
    //if not, add to start of search history list so that the most recent search is listed at top
    //if location already exist, then move to top of list, in order of latest to oldest.
    //if max length reached, then take off older search history
    let findRecordIndex = searchList.findIndex(
        function (record) {
            if (record.city == cityName && record.country == countryCode) { return true; }
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

//Function for displaying previous user submissions
function displaySearchHistory() {

    checkSearchHistory();
    for (let items in searchList) {
        let searchButton = document.createElement("button");
        searchButton.setAttribute("type", "button");
        searchButton.setAttribute("class", "customBtn");
        searchButton.setAttribute("data-city", searchList[items].city);
        searchButton.setAttribute("data-country", searchList[items].country);
        if (!searchList[items].country) {
            searchButton.textContent = `${searchList[items].city}`;
        } else {
            searchButton.textContent = `${searchList[items].city}, ${searchList[items].country}`;
        }
        searchHistory.appendChild(searchButton);
    }
}


//Function to reset page to blank before updating new search results
function resetPageData() {
    currentDetails.innerHTML = "";
    searchHistory.innerHTML = "";
    forecastDisplay.innerHTML = "";
}

//Use function to create re-usable HTML elements
function createTempElement(temp, parent) {
    if (!temp) {
        return;
    }
    //metrics measurement: Celsius degrees
    let tempEl = document.createElement("p");
    tempEl.textContent = `Temperature: ${temp}℃ degrees`;
    return parent.appendChild(tempEl);
}

function createHumElement(humidity, parent) {
    if (!humidity) {
        return;
    }
    //metrics measurement: %
    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${humidity}%`;
    return parent.appendChild(humidityEl);
}

function createWindElement(wind, parent) {
    if (!wind) {
        return;
    }
    //metrics measurement: meter/sec
    let windEl = document.createElement("p");
    windEl.textContent = `Wind speed: ${wind} meters/sec`;
    return parent.appendChild(windEl);
}

function createImgElement(icon, weatherDes, parent) {
    if (!icon) {
        return;
    }
    let image = document.createElement("img");
    image.setAttribute("src", `https://openweathermap.org/img/wn/${icon}.png`);
    image.setAttribute("alt", weatherDes);
    parent.appendChild(image);
}

