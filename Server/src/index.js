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
    var cityinfo = [];
    var timezoneinfo = [];
    var country;
    var lat;
    var lng;
    var currencycode;
    var conversionrate;
    var seconds;

    var date = new Date();//new date object
    seconds = Math.round(date.getTime() / 1000);//getting the amount of seconds since epoch, to use on timezone API call

    //this will find the city in the json file and grab the country name, latitude, and longitude values
    for (var i = 0; i < worldcities.length; i++){
        if(worldcities[i]["city"] == name){
            country = worldcities[i]["country"];
            lat = worldcities[i]["lat"];
            lng = worldcities[i]["lng"];
        }
    }
    cityinfo.push(country);//push the country name to the return array

    //this will find the currency code for the current city's country
    for(var j = 0; j < currencies.length; j++){
        if(currencies[j]["Country"] == country){
            currencycode = currencies[j]["Currency Code"];
        }
    }

    conversionrate = currency[0]["conversion_rates"][currencycode];//this will use the array from the API to get conversion rate from the currency code
    cityinfo.push(conversionrate);//push the conversion rate to the array
   
    //make the timezone API call to get timezone and epoch of specified lat/lng
    /*
    request(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${seconds}&key=AIzaSyAD3EPT5bdU6tzanFyeBhpOgIKuAj8cg1U`, function(error, response, body) {
        timezoneinfo.push(JSON.parse(body));
    });
    */
    
    
    
    res.send(cityinfo);//send the array to user  
});
