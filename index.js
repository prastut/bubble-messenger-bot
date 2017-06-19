'use strict'

var ip = "http://139.59.25.186/";
var trackingLiveMatchUrl = "get-data";
var getTeamData = 'get-team-data';

var sampleTeamData = {
    "instance_id": "5943dbd7bb46ec194075e4eb",
    "monsoon_allergy": {
        "1497595370": {
            "neg": 0.14855887235839849,
            "neg_count": 10,
            "pos": 2.416569558850262,
            "pos_count": 60
        },
        "1497595400": {
            "neg": 0.07736161121962223,
            "neg_count": 9,
            "pos": 2.4018382437497747,
            "pos_count": 50
        },
        "1497595430": {
            "neg": 0.26440307849935174,
            "neg_count": 11,
            "pos": 2.8790858789234104,
            "pos_count": 51
        },
        "1497595460": {
            "neg": 0.139300418079936,
            "neg_count": 7,
            "pos": 2.81081118843658,
            "pos_count": 60
        }
    }
};

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 443))
app.set('view engine', 'pug')
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
        .get(getParams('get-live-matches', { type: 'cricket-match' }))
        .on('data', function(chunk) {
            res.send(getLiveData(chunk));
        });

});

app.get('/get-data', function(req, res) {

    request
        .get(getParams('get-match-details', req.query), function callBack(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }

            res.send(matchSpecificData(body));
        });




});

app.get('/get-team-data', function(req, res) {
    var singleOrBoth = req.query.team == "both" ? 2 : 1;

    // if (singleOrBoth == 1) {
    //     request
    //         .get(getParams('get-index-data', req.query), function callBack(err, httpResponse, body) {
    //             if (err) {
    //                 return console.error('upload failed:', err);
    //             }

    //             res.send(teamData(sampleTeamData));
    //         });

    // }


    res.send(teamData(sampleTeamData));
});



//Web Views

app.get('/team', function(req, res) {

    var team = req.query.team;

    res.render('team', {
        title: capitalizeFirstLetter(team),
        message: team
    });
});




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

    // console.log(data);

    for (var i in data.channels) {

        if (data.channels[i].type == "team") {

            quick_replies.push({
                "title": data.channels[i].name,
                "url": ip + getTeamData + "?team=" + i + "&instance_id=" + data.instance_id,
                "type": "json_plugin_url"
            });

        }
    }

    quick_replies.push({
        "title": "Both",
        "url": ip + getTeamData + "?team=" + "both" + "&instance_id=" + data.instance_id,
        "type": "json_plugin_url"

    });

    var payload = {
        "messages": [{
            "text": "Which team are you supporting?",
            "quick_replies": quick_replies
        }]
    };

    return payload;

}

function teamData(data) {

    var channel = Object.keys(data)[1 - Object.keys(data).indexOf('instance_id')];

    // var liveData = {
    //     "messages": [{
    //         "attachment": {
    //             "type": "template",
    //             "payload": {
    //                 "template_type": "generic",
    //                 "elements": elements
    //             }
    //         }
    //     }]
    // };

    console.log(channel);

    var payload = {
        "messages": [{
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "India",
                            "subtitle": "#Tweet Count: 2000",
                            "buttons": [{
                                "type": "web_url",
                                "url": ip + "team?team=india",
                                "title": "See More"
                            }]
                        }]
                    }
                }
            }

        ]
    };


    return payload;

}

// function getParamsData(url, )


function getParams(url, params) {

    // console.log(params);
    return { url: customUrlGenerator(url), qs: params, json: true };
}


function customUrlGenerator(url) {
    return "http://bubble.social/" + url;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}