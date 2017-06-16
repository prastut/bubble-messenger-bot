'use strict'

var ip = "http://139.59.25.186/";
var trackingLiveMatchUrl = "get-data";
var getTeamData = 'get-team-data';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 443))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {

    res.send("Hey I am a Bubble Social Chatbot");
});

app.get('/get-live-matches', function(req, res) {
    request
        .get(getParams('get-live-matches', 'type', 'cricket-match'))
        .on('data', function(chunk) {
            res.send(getLiveData(chunk));
        });

});

app.get('/' + trackingLiveMatchUrl, function(req, res) {

    var instance_id = req.query.instance_id;
    request
        .get(getParams('get-match-details', 'instance_id', instance_id), function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }

            matchSpecificData(body);
        });

    res.send([{ "text": "Hello" }]);


});

app.get('/' + getTeamData, function(req, res) {

    // console.log(req.query);
    res.send([{ "text": "Hello World" }]);
})





// for Facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }

    if (req.query['messaging_postbacks']) {
        console.log(req.query['messaging_postbacks']);

    }

    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})



function getLiveData(data) {

    var str = "";
    str += data;
    var liveMatchesData = JSON.parse(str);

    var elements = [];

    for (var i in liveMatchesData) {

        elements.push({
            "title": liveMatchesData[i].name,
            "image_url": liveMatchesData[i].url,
            "buttons": [{
                "url": ip + trackingLiveMatchUrl + "?instance_id=" + liveMatchesData[i].instance_id,
                "title": "Track this!",
                "type": "json_plugin_url"
            }]
        });
    }



    var liveData = {
        "messages": [{
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": elements
                }
            }
        }]
    };

    return liveData;
}


function matchSpecificData(data) {

    var quick_replies = [];


    for (var i in data.channels) {


        if (data.channels.i.team) {

            quick_replies.push({
                "title": data.channels.i.name,
                "url": ip + getTeamData + "?team=" + i,
                "type": "json_plugin_url"
            });

        }
    }

    console.log(quick_replies);

    var payload = {
        "messages": [{
            "text": "Which team are you supporting?",
            "quick_replies": [{
                    "title": "Team 1",
                    "url": ip + getTeamData + "?instance_id=" + 1,
                    "type": "json_plugin_url"

                },
                {
                    "title": "Team 2",
                    "url": ip + getTeamData + "?instance_id=" + 2,
                    "type": "json_plugin_url"

                },
                {
                    "title": "Both",
                    "url": ip + getTeamData + "?instance_id=" + 0,
                    "type": "json_plugin_url"

                }
            ]
        }]
    };

    return payload;

}


// var liveElements = function(teams) {

//     var array = [];

//     for (var i in teams) {
//         array.push()
//     }
// };

function getParams(url, param, value) {

    var params = {};
    params[param] = value;
    return { url: customUrlGenerator(url), qs: params, json: true };
}


function customUrlGenerator(url) {
    return "http://bubble.social/" + url;
}