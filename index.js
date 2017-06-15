'use strict'
var data = {
    "messages": [{
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Paul Scholes",
                        "image_url": "https://en.wikipedia.org/wiki/Paul_Scholes",
                        "subtitle": "Soft white cotton t-shirt is back in style",
                        "buttons": [{
                            "type": "web_url",
                            "url": "https://petersapparel.parseapp.com/view_item?item_id=100",
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
    // var jsonResponse = [];
    // jsonResponse.push(data);
    res.send(data);
})

// for Facebook verification
app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})