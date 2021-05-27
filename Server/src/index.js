const express = require('express');
const bodyParser = require ('body-parser');
const worldcities = require('../worldcities.json');
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
    console.log(currency);
    const name = req.params.name;

    //we want to grab the object from the cities json with the specified name
    //then return that city's iso3, lat, and lng

    var cityinfo = [];

    for (var i = 0; i < worldcities.length; i++){
        if(worldcities[i]["city"] == name){
            cityinfo.push(worldcities[i]["lat"]);
            cityinfo.push(worldcities[i]["lng"]);
            cityinfo.push(worldcities[i]["iso3"]);
        }
    }
    res.send(cityinfo);
    
})
