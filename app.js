'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();

app.set('port', (process.env.PORT || 443))
app.set('view engine', 'ejs')

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Process application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// for Facebook verification
app.use('/webhook/', require('./routes/fb-webhook'));

// Routes
app.use('/', require('./routes/index'));

// Bot Routes
app.use('/get-live-matches', require('./routes/bot/step-1/get-live-matches'));

app.use('/get-support', require('./routes/bot/step-2/get-support'));

app.use('/get-team-data', require('./routes/bot/step-3/get-team-data'));
app.use('/screenshot', require('./routes/bot/step-3/screenshot'));
app.use('/get-webview', require('./routes/bot/step-3/webview'));
app.use('/quick-replies', require('./routes/bot/step-3/quick-replies'));

//Web Routes
app.use('/match-view', require('./routes/web/match-view'));
app.use('/form', require('./routes/web/form'));
app.use('/trending', require('./routes/web/trending'));


app.use(function(err, req, res, next) {
    console.error(err.stack)
    res.status(500).send([{ "text": "Sorry! (Check Logs" }]);
});

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))

});