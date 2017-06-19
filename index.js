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



app.use('/', require('./routes/index'));
app.use('/get-live-matches', require('./routes/get-live-matches'));
''


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

    var teamResponse = req.query;
    var singleOrBoth = teamResponse.channel == "both" ? 2 : 1;

    teamResponse.last_timestamp = 0;

    if (singleOrBoth == 1) {
        var flag = teamResponse.image_url;
        delete teamResponse.image_url;

        request
            .get(getParams('get-index-data', teamResponse), function callBack(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }

                res.send(teamData(body, flag));
            });

    }


    // res.send(teamData(sampleTeamData));
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






function matchSpecificData(data) {

    var quick_replies = [];

    // console.log(data);

    for (var i in data.channels) {

        if (data.channels[i].type == "team") {

            quick_replies.push({
                "title": data.channels[i].name,
                "url": ip + getTeamData +
                    "?channel=" + i +
                    "&instance_id=" + data.instance_id +
                    "&img_url=" + data.channels[i].image_url,
                "type": "json_plugin_url"
            });

        }
    }

    quick_replies.push({
        "title": "Both",
        "url": ip + getTeamData + "?channel=" + "both" + "&instance_id=" + data.instance_id,
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

function teamData(data, flag) {

    var channel = Object.keys(data)[1 - Object.keys(data).indexOf('instance_id')];



    var payload = {
        "messages": [{
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Classic White T-Shirt",
                        "image_url": "http://petersapparel.parseapp.com/img/item100-thumb.png",
                        "subtitle": "Soft white cotton t-shirt is back in style",
                        "buttons": [{
                                "type": "web_url",
                                "url": "https://petersapparel.parseapp.com/view_item?item_id=100",
                                "title": "View Item"
                            },
                            {
                                "type": "web_url",
                                "url": "https://petersapparel.parseapp.com/buy_item?item_id=100",
                                "title": "Buy Item"
                            }
                        ]
                    }]
                }
            }
        }, {
            "text": "Let's check",
            "quick_replies": [{
                "type": "web_url",
                "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                "title": "Buy Item"
            }]
        }]
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