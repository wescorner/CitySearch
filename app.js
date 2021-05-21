const express = require('express');
const bodyParser = require ('body-parser');

//initialize express app
const app = express();
const port = 3000;

//open the port to listening
app.listen(port, () => {
    console.log('Server is up and running on port ' + port);
});

//root
app.get('/', (req, res) => {
    res.send('Hello World');
});

//creating the city inquiry get request
app.get('/api/city/:name', (req, res) => {
    const name = req.params.name;
    res.send(name);
    console.log(`GET request for ${req.url}`);
})