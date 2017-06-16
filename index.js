'use strict'

var ip = "http://139.59.25.186/";
var trackingLiveMatchUrl = "get-data";
var getTeamData = 'get-team-data';

function getLiveData() {

    var liveMatchesData = [{
            "instance_id": "59429e68bb46ec1beeee04fc",
            "name": "India vs Bangladesh",
            "url": "https://lh3.googleusercontent.com/iYpxxu6ij6guq0V-aHsed6KpKUFTyN2bz5kLoFe0x5GM7IzpTos-B4RO3H6LIwHB7Mk=h900",
            "time": 1497538153
        },
        {
            "instance_id": "59410b78bb46ec2e26dbaad8",
            "name": "England vs Pakistan",
            "time": "1497415180"
        },
        {
            "instance_id": "5941012abb46ec2e26dbaaca",
            "name": "South Africa vs India",
            "time": "0"
        }
    ];

    var elements = []

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


function matchSpecificData(instance_id) {

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




const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 443))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function(req, res) {

    res.send("Hey I am a Bubble Social Chatbot");
})

app.get('/get-live-matches', function(req, res) {

    res.send(getLiveData());


})

app.get('/' + trackingLiveMatchUrl, function(req, res) {

    var instance_id = req.query.instance_id;
    res.send(matchSpecificData(instance_id));


});

app.get('/' + getTeamData, function(req, res) {

    console.log(req.query);
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