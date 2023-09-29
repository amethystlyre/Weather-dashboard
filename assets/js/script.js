var apiKey = "f50be9a02d66256a8b3502a7e6f70428";
var cityName = "";
var countryCode = "";
var limit = "5";

var cityLat = "-37.8141705";
var cityLon = "144.965561";
var tempUnit = "metric";
var weatherData;
var forecastData=[];

var userCityName = document.querySelector("#cityName");
var searchButton = document.querySelector("#searchbtn");

var currentWeather = document.querySelector("#currentWeather");
var currentDetails = document.querySelector("#currentWeatherDetail");


searchButton.addEventListener("click",function(event){
    event.preventDefault();

    currentDetails.innerHTML="";

    if (!userCityName.value){
        return;
    }
    else if (userCityName.value.includes(" ")){
        var searchString = userCityName.value.split(" ");
        cityName = searchString[0].charAt(0).toUpperCase() + searchString[0].slice(1);
        countryCode = searchString[1].toUpperCase();
    }
    else{
        cityName = userCityName.value.charAt(0).toUpperCase()+userCityName.value.slice(1);
        countryCode = "";
    }
    //currentWeather.textContent = `${cityName} ${countryCode}`;

    //console.log(cityName);  
    //console.log(countryCode);
    let cityLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`;
    //console.log(cityLocationUrl);

    getCityLocation(cityLocationUrl)
    .then(locationData => getWeatherData(locationData))
    .then(weatherData => processWeatherData(weatherData))
    .catch((error) => {
        console.error(error);
        alert('Unable to connect');
    });

});

function getCityLocation(url) {
    return fetch(url)  // return this promise
    .then(
        //response => response.json()
        function (response) {
            if (response.ok) {
                console.log(response.statusText);
                return response.json();
            }
            else{
                alert('Error: ' + response.statusText);
                console.log(response.statusText);
                return Promise.reject(response.json());        
            }
        }
    );
}



function getWeatherData(data) {
    //console.log(data);
    cityLat = data[1].lat;
    console.log("lat: " + cityLat);
    cityLon = data[1].lon;
    console.log("lon: " + cityLon);
    cityCountry = data[1].country;
    console.log("Country: " + cityCountry);
    
    let weatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${tempUnit}&appid=${apiKey}`;
    return fetch(weatherURL)
    .then(response => response.json());
}


function processWeatherData(data){
    weatherData=data.list 
    //console.log(weatherData[0]);
    
    renderCurrentWeather(weatherData[0]);
    for (let i=1; i<6; i++){
        let forecast = dayjs().add(i,"day").format("YYYY-MM-DD");
        //console.log(forecast);
        let firstRecord = weatherData.find((element) => element.dt_txt.slice(0,10) == forecast)
        //console.log("found: "+JSON.stringify(found));
        forecastData.push(firstRecord);
    }
    console.log(forecastData);
    renderForecastWeather(forecastData);

}

function renderCurrentWeather(currentWeatherObject){
    let date = currentWeatherObject.dt_txt.slice(0,10);
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
    tempEl.textContent= `Temperature: ${temp}℃ degrees`;
    currentDetails.appendChild(tempEl);

    let humidity = currentWeatherObject.main.humidity //metrics measurement: %
    //console.log(humidity);
    let humidityEl = document.createElement("p");
    humidityEl.textContent= `Humidity: ${humidity}%`;
    currentDetails.appendChild(humidityEl);

    let wind = currentWeatherObject.wind.speed//metrics measurement: meter/sec
    //console.log(wind);
    let windEl = document.createElement("p");
    windEl.textContent= `Wind speed: ${wind} meters/sec`;
    currentDetails.appendChild(windEl);
}

function renderForecastWeather(forecastDataList){

    for (let i=0; i<forecastDataList.length ;i++){

    let forecast= document.querySelector("#cardDay"+i);

    let date = forecastDataList[i].dt_txt.slice(0,10);
    let displayDateFormat = dayjs(date).format("DD/MM/YYYY");
    //console.log(date);

    let weatherDes = forecastDataList[i].weather["0"].description;

    let icon = forecastDataList[i].weather["0"].icon;
    //console.log(icon);
    var dateHead = document.createElement("h4");
    dateHead.textContent = displayDateFormat;
    forecast.appendChild(dateHead);

    var image = document.createElement("img");
    image.setAttribute("src", `https://openweathermap.org/img/wn/${icon}.png`);
    image.setAttribute("alt", weatherDes);
    image.setAttribute("alt", weatherDes);
    forecast.appendChild(image);
    
    let temp = forecastDataList[i].main.temp //metrics measurement: C degrees
    //console.log(temp);
    let tempEl = document.createElement("p");
    tempEl.textContent= `Temperature: ${temp}℃ degrees`;
    forecast.appendChild(tempEl);

    let humidity = forecastDataList[i].main.humidity //metrics measurement: %
    //console.log(humidity);
    let humidityEl = document.createElement("p");
    humidityEl.textContent= `Humidity: ${humidity}%`;
    forecast.appendChild(humidityEl);

    let wind = forecastDataList[i].wind.speed//metrics measurement: meter/sec
    //console.log(wind);
    let windEl = document.createElement("p");
    windEl.textContent= `Wind speed: ${wind} meters/sec`;
    forecast.appendChild(windEl);
    }
}







