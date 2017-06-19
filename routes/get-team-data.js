const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");

var webshot = require('webshot');





router.get('/', function(req, res, next) {

    var teamResponse = req.query;
    var singleOrBoth = teamResponse.channel == "both" ? 2 : 1;

    teamResponse.last_timestamp = 0;

    if (singleOrBoth == 1) {
        var flag = teamResponse.image_url;
        delete teamResponse.image_url;

        request
            .get(helper.getParams('get-index-data', teamResponse), function callBack(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }

                res.send(teamData(body, flag));
            });

    }
});


function teamData(data, flag) {

    var channel = Object.keys(data)[1 - Object.keys(data).indexOf('instance_id')];
    var keysSorted = Object.keys(data[channel]).map(Number).sort();
    var maxKey = keysSorted[keysSorted.length - 1];

    console.log(data);

    var neg = data[channel][maxKey].neg;
    var pos = data[channel][maxKey].pos;

    var screenshotUrl = helper.ip + "screenshot" +
        "?title=" + channel +
        "&channel=" + channel +
        "&flag=" + flag +
        "&neg=" + neg +
        "&pos=" + pos;


    webshot(screenshotUrl, channel + '-screenshot.jpeg', helper.optionsPhone, function(err) {
        console.log(err);
    });

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
            "text": "Additionally you can do the following as well:",
            "quick_replies": [{
                    "type": "web_url",
                    "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                    "title": "Follow"
                },
                {
                    "type": "web_url",
                    "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                    "title": "Trending Players"
                },
                {
                    "type": "web_url",
                    "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                    "title": "Heroes/Zeroes"
                }, {
                    "type": "web_url",
                    "url": "https://petersapparel.parseapp.com/buy_item?item_id=101",
                    "title": "Track Rival Team"
                }
            ]
        }]
    };



    return payload;

}


module.exports = router;