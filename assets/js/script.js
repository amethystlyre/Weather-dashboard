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



searchButton.addEventListener("click",function(event){
    event.preventDefault();

    if (!userCityName.value){
        return;
    }
    else if (userCityName.value.includes(" ")){
        var searchString = userCityName.value.split(" ");
        cityName = searchString[0].toLowerCase();
        countryCode = searchString[1].toUpperCase();
    }
    else{
        cityName = userCityName.value;
        countryCode = "";
    }
    currentWeather.textContent = `${cityName} ${countryCode}`;

    //console.log(cityName);  
    //console.log(countryCode);
    let cityLocationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`;
    //console.log(cityLocationUrl);

    getCityLocation(cityLocationUrl)
    .then(locationData => getWeatherData(locationData))
    .then(weatherData => processWeatherData(weatherData))
    .catch((error) => {
        console.error(error);
    });

});

function getCityLocation(url) {
    return fetch(url)  // return this promise
    .then(response => response.json());
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
    console.log(weatherData);



    //console.log(dayjs().add(1,"day").format("YYYY-MM-DD"));

    for (let i=1; i<6; i++){
        let forecast = dayjs().add(i,"day").format("YYYY-MM-DD");
        //console.log(forecast);
        let firstRecord = data.list.find((element) => element.dt_txt.slice(0,10) == forecast)
        //console.log("found: "+JSON.stringify(found));
        forecastData.push(firstRecord);
    }
    console.log(forecastData);

}

function renderCurrentWeather(currentWeatherObject){
    let date = weatherData[0].dt_txt.slice(0,10)
    //console.log(date);

    let temp = data.list[0].main.temp //metrics measurement: C degrees
    //console.log(temp);

    let humidity = data.list[0].main.humidity //metrics measurement: %
    console.log(humidity);
    let wind = data.list[0].wind.speed//metrics measurement: meter/sec
    console.log(wind);

    let icon = data.list[0].weather["0"].icon
    //console.log(icon);

}

