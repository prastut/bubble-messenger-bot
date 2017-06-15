'use strict'




function getLiveData() {

    var liveMatchesData = [{
            "instance_id": "5942ab66bb46ec32826fa0c6",
            "name": "aoehwdsf'ls;gh",
            "time": 1497541478
        },
        {
            "instance_id": "5942ab64bb46ec32826fa0c5",
            "name": "aoehwdsf'ls;gh",
            "time": 1497541477
        },
        {
            "instance_id": "59429e68bb46ec1beeee04fc",
            "name": "INDVSBAN15062017",
            "time": 1497538153
        },
        {
            "instance_id": "59410b78bb46ec2e26dbaad8",
            "name": "ENGVSPAKPONLYMATCH",
            "time": "1497415180"
        },
        {
            "instance_id": "5941012abb46ec2e26dbaaca",
            "name": "ENGVSPAK14062017",
            "time": "0"
        }
    ];

    for (var i in liveMatchesData) {

        console.log(i.name);
    }

}


// var liveElements = function(teams) {

//     var array = [];

//     for (var i in teams) {
//         array.push()
//     }
// };

var liveData = {
    "messages": [{
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Paul Scholes",
                        "buttons": [{
                            "type": "web_url",
                            "url": "http://prastutkumar.design/info-design-lab-work/bubble/main/index.html",
                            "title": "View Sentiment",
                            "webview_height_ratio": "compact"
                        }]
                    },
                    {
                        "title": "Classic Grey T-Shirt",
                        "image_url": "http://petersapparel.parseapp.com/img/item101-thumb.png",
                        "subtitle": "Soft gray cotton t-shirt is back in style",
                        "buttons": [{
                                "type": "web_url",
                                "url": "https://petersapparel.parseapp.com/view_item?item_id=101",
                                "title": "View Item"
                            },
                            {
                                "type": "web_url",
                                "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                                "title": "Buy Item"
                            }
                        ]
                    }
                ]
            }
        }
    }]
};


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
    getLiveData();
    res.send(data);
})

app.get('/get-live-matches', function(req, res) {

    res.send(data)


})

// for Facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }

    // console.log(req.query['messaging_postbacks']);

    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})