const express = require('express');
const bodyParser = require ('body-parser');
const worldcities = require('../worldcities.json');
const currencies = require('../currencies.json');
const request = require('request');

//initialize express app
const app = express();
const port = 3000;

//MongoDB connection
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://wescorner:golfme5665@cluster0.72r0y.mongodb.net/CitySearch?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function connect(){
    try{    
        await client.connect();
        console.log('Connected to MongoDB...');
    } catch (e){
        console.error(e);
    }
}
connect().catch(console.error);

//load bodyparser middleware
app.use(bodyParser.json());

//open the port to listening
app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});





//currency API
//https://v6.exchangerate-api.com/v6/c062528abc5d3fae4044a83d/latest/CAD

//timezone API
//https://maps.googleapis.com/maps/api/timezone/json?location=LAT,LNG&timestamp=0&key=AIzaSyAD3EPT5bdU6tzanFyeBhpOgIKuAj8cg1U

var username;
currency = [];

//make the currency API call and push resulting object to currency array
request('https://v6.exchangerate-api.com/v6/c062528abc5d3fae4044a83d/latest/CAD', function(error, response, body) {
    currency.push(JSON.parse(body));
});

//root
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/login/:name', (req, res) => {//this is going to set the current active user
    console.log(`GET request for ${req.url}`);
    const name = req.params.name;

    async function userExists(){
        result = await client.db("CitySearch").collection("users").find({name: name}).count()>0;
        return result;
    }
    
    async function login(){
        var exists = await userExists();
        if(exists){
            username = req.params.name;
            res.send("Successfully logged in!");
        }else{
            res.status(400).send(`Error- ${name} is not a user!`);
        }
    }
    login(name);
    
});
/*
app.put('api/savecity/:city', (req, res) => {//this is going to save a city under a user's name in the db
    console.log(`POST request for ${req.url}`);
    city = req.params.city;

    async function cityExists(){
        result = await client.db("CitySearch").collection("users").find({cities: city}).count()>0;
        return result;
    }

    async function lessThanFive(){
        x = await client.db("CitySearch").collection("users").find({name: username});
        if (x["cities"].length <= 5){
            result = true;
        }else{
            result = false;
        }
        return result;
    }

    async function saveCity(){
        var exists = await cityExists();
        var lessThan = await lessThanFive();

        if(!exists && lessThan){
            x = await client.db("CitySearch").collection("users").find({name: username});
            cities = x["cities"];
            cities.push(city);
            var query = {name: username};
            var values = {$set: {cities}};
            client.db("CitySearch").collection("users").updateOne(query, values, (err, res) => {
                if (err) throw err;
            });
            res.send(`${city} has been saved.`);
        }else{
            res.status(400).send("Error adding city");
        }
    }
    saveCity();


});
*/
app.get('/api/viewcities/', (req, res) => {//this is going to view the currently saved cities for a user
    console.log(`GET request for ${req.url}`);
    console.log(username);
    var cities = [];

    client.db("CitySearch").collection("users").find({name: username}, {projection: {_id:0, name:0}}).toArray(function(err, result){
        if(err) throw err;
        cities = result[0]["cities"];
        res.send(cities);

    });


});


//adding a new user
app.post('/api/createuser/:name', (req, res) => {
    console.log(`POST request for ${req.url}`);
    const name = req.params.name;

    //function to check if user already exists
    async function userExists(){
        result = await client.db("CitySearch").collection("users").find({name: name}).count()>0;
        return result;
    }

    async function createUser(){
        var exists = await userExists();
        if(exists){
            res.status(400).send(`Error- ${name} is already a user!`);
        }else{
            await client.db("CitySearch").collection("users").insertOne({name: name, cities: []});
            res.send(`Created user ${name}`);
        }
    }
    createUser(name);

    
})


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
    cityinfo[0]["conversion"] = ("The conversion rate from CAD to " + currencycode + " is: " + conversionrate);

    //need to make a promise chain:
    //first will retrieve offset
    //then will calculate local time based on offset result
    //then will retreive weather information
    //then will res.send the final result with everything
    new Promise(function(resolve, reject){
        //retreive offset
        request(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${seconds}&key=AIzaSyAD3EPT5bdU6tzanFyeBhpOgIKuAj8cg1U`, function(error, response, body) {
        var timezoneinfo = (JSON.parse(body));//parsing the information received from API call to json object
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
        weatherinfo = (JSON.parse(body));//parsing the information received from API call to json object

        //setting weather values
        cityinfo[0]["temperature"] = ("The temperature is " + weatherinfo["data"]["current"]["weather"].tp + " degrees Celcius");
        cityinfo[0]["humidity"] = ("The humidity is " + weatherinfo["data"]["current"]["weather"].hu + "%");
        cityinfo[0]["wind"] = ("The wind speed is " + weatherinfo["data"]["current"]["weather"].ws + "kmh");
        resolve();
        });
    }).then(function(){
        res.send(cityinfo);//sending final array object to user
    });
});
