const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");


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


module.exports = router;