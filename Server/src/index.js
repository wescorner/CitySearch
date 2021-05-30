const express = require('express');
const bodyParser = require ('body-parser');
const worldcities = require('../worldcities.json');
const currencies = require('../currencies.json');
const request = require('request');



//initialize express app
const app = express();
const port = 3000;

//open the port to listening
app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});

//currency API
//https://v6.exchangerate-api.com/v6/c062528abc5d3fae4044a83d/latest/CAD

//timezone API
//https://maps.googleapis.com/maps/api/timezone/json?location=LAT,LNG&timestamp=0&key=AIzaSyAD3EPT5bdU6tzanFyeBhpOgIKuAj8cg1U

currency = [];

//make the currency API call and push resulting object to currency array
request('https://v6.exchangerate-api.com/v6/c062528abc5d3fae4044a83d/latest/CAD', function(error, response, body) {
    currency.push(JSON.parse(body));
});

//root
app.get('/', (req, res) => {
    res.send('Hello World');
});

//creating the city inquiry get request
app.get('/api/city/:name', (req, res) => {
    console.log(`GET request for ${req.url}`);
    const name = req.params.name;

    //declaring variables
    var cityinfo = [{
        "country":"",
        "conversion":"",
        "time":"",
        "temperature":"",
        "humidity":"",
        "wind":""
    }];
    var weatherinfo = [];
    var country;
    var lat;
    var lng;
    var currencycode;
    var conversionrate;
    var seconds;
    var dstoffset;
    var rawoffset;

    var date = new Date();//new date object
    seconds = Math.round((date.getTime() + (date.getTimezoneOffset() * 60000))/ 1000);//getting the amount of seconds since epoch, to use on timezone API call

    //this will find the city in the json file and grab the country name, latitude, and longitude values
    for (var i = 0; i < worldcities.length; i++){
        if(worldcities[i]["city"] == name){
            country = worldcities[i]["country"];
            lat = worldcities[i]["lat"];
            lng = worldcities[i]["lng"];
        }
    }
    cityinfo[0]["country"] = (name + " is located in the country " + country);//setting country value

    //this will find the currency code for the current city's country
    for(var j = 0; j < currencies.length; j++){
        if(currencies[j]["Country"] == country){
            currencycode = currencies[j]["Currency Code"];
        }
    }

    conversionrate = currency[0]["conversion_rates"][currencycode];//this will use the array from the API to get conversion rate from the currency code
    
    //setting cityinfo conversion value
    cityinfo[0]["conversion"] = ("The conversion rate from CAD to " + currencycode + " is: " + conversionrate)

    //need to make a promise chain:
    //first will retrieve offset
    //then will calculate local time based on offset result
    //then will retreive weather information
    //then will res.send the final result with everything
    new Promise(function(resolve, reject){
        //retreive offset
        request(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${seconds}&key=AIzaSyAD3EPT5bdU6tzanFyeBhpOgIKuAj8cg1U`, function(error, response, body) {
        var timezoneinfo = (JSON.parse(body));
        dstoffset = timezoneinfo["dstOffset"];
        rawoffset = timezoneinfo["rawOffset"]; 
        resolve(1000*(dstoffset + rawoffset + seconds));//sum offsets to take daylight savings into account
        });
    }).then(function(result){
        //converting the calculated number to a date+time string and setting value
        var nd = new Date(result);

        cityinfo[0]["time"] = ("The current date and time is: " + nd.toLocaleString());

    });

    new Promise(function(resolve, reject){
        request(`https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=d29eb4c3-4ca2-4235-875b-e4588b67f1e5`, function(error, response, body){
        weatherinfo = (JSON.parse(body));
        console.log(lat);
        console.log(lng);
        console.log(weatherinfo);

        cityinfo[0]["temperature"] = ("The temperature is " + weatherinfo["data"]["current"]["weather"].tp + " degrees Celcius");
        cityinfo[0]["humidity"] = ("The humidity is " + weatherinfo["data"]["current"]["weather"].hu + "%");
        cityinfo[0]["wind"] = ("The wind speed is " + weatherinfo["data"]["current"]["weather"].ws + "kmh");
        resolve();
        });
    }).then(function(){
        res.send(cityinfo);
    });
    /*
    .then(function(){
        //getting weather info via lat and long
        request(`https://api.airvisual.com/v2/nearest_city?lat=35.98&lon=140.33&key=d29eb4c3-4ca2-4235-875b-e4588b67f1e5`, function(error, response, body){
        weatherinfo = (JSON.parse(body));
        console.log(lat);
        console.log(lng);
        console.log(weatherinfo);
        //setting weather values in cityinfo object
        cityinfo[0]["temperature"] = ("The temperature is " + weatherinfo["data"]["current"]["weather"].tp + " degrees Celcius");
        cityinfo[0]["humidity"] = ("The humidity is " + weatherinfo["data"]["current"]["weather"].hu + "%");
        cityinfo[0]["wind"] = ("The wind speed is " + weatherinfo["data"]["current"]["weather"].ws + "kmh");
        
        });

    }).then(function(){
        //sending the final array to the user
        setTimeout(() => {res.send(cityinfo)}, 500);//setting timeout for res.send so it doesn't send before array is updated
        //this solution may be temporary but works for now
    });
    */
});
