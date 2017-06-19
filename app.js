'use strict'

var ip = "http://139.59.25.186/";
var trackingLiveMatchUrl = "get-data";
var getTeamData = 'get-team-data';


const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const app = express();

app.set('port', (process.env.PORT || 443))
app.set('view engine', 'pug')

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Process application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// for Facebook verification
app.use('/webhook/', require('./routes/fb-webhook'));

// Routes
app.use('/', require('./routes/index'));
app.use('/get-live-matches', require('./routes/get-live-matches'));
app.use('/get-data', require('./routes/get-data'));
app.use('/get-team-data', require('./routes/get-team-data'));



//Web Views

app.get('/team', function(req, res) {

    var team = req.query.team;
    res.render('team', {
        title: capitalizeFirstLetter(team),
        message: team
    });
});




// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))

});