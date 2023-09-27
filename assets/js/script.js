var apiKey = "f50be9a02d66256a8b3502a7e6f70428";
var cityName = "Melbourne";
var countryCode = "AU";
var limit = "5";

var cityLat="-37.8141705";
var cityLon="144.965561";
var tempUnit = "metric";


//getLocationCoord ();

function getLocationCoord (){

fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=${limit}&appid=${apiKey}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("data: "+data);
    cityLat = data[1].lat;
    console.log("lat: "+cityLat);
    cityLon = data[1].lon;
    console.log("lon: "+cityLon);
  }).then(function(){
    let weatherURL=`api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${tempUnit}&appid=${apiKey}`;
    var result = fetch(weatherURL);
    console.error(result);
  })
  .catch((error) => {
    console.error(error);
  });

}


fetch(`api.openweathermap.org/data/2.5/forecast?lat=-37.8141705&lon=144.965561&units=${tempUnit}&appid=${apiKey}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("data: "+data);
  })
  .catch((error) => {
    console.error(error);
  });

