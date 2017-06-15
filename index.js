'use strict'

var teams = ["india", "pakistan"];

var liveElements = function(teams) {

    var array = [];

    for (var i in teams) {
        console.log(teams);
    }
};

var liveData = {
    "messages": [{
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Paul Scholes",
                        "image_url": "http://www.blogcdn.com/www.parentdish.co.uk/media/2011/09/paulscholes.jpg",
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
    liveElements(teams);
    // res.send(data);
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