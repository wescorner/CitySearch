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

currency = [];

request('https://v6.exchangerate-api.com/v6/c062528abc5d3fae4044a83d/latest/CAD', function(error, response, body) {
    currency.push(JSON.parse(body));
    
})


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
    var country;
    var lat;
    var lng;
    var currencycode;
    var conversionrate;

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
    res.send(cityinfo);//send the array to user
    
})
