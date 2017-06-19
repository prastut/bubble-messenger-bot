const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");

router.get('/', function(req, res, next) {

    request
        .get(helper.getParams('get-match-details', req.query), function callBack(err, httpResponse, data) {
            if (err) {
                return console.error('upload failed:', err);
            }

            var quick_replies = [];

            console.log(data);

            for (var i in data.channels) {

                if (data.channels[i].type == "team") {

                    quick_replies.push({
                        "title": data.channels[i].name,
                        "url": helper.ip + 'get-team-data' +
                            "?channel=" + i +
                            "&instance_id=" + data.instance_id +
                            "&img_url=" + data.channels[i].img_url,
                        "type": "json_plugin_url"
                    });

                }
            }

            quick_replies.push({
                "title": "Both",
                "url": helper.ip + 'get-team-data' + "?channel=" + "both" + "&instance_id=" + data.instance_id,
                "type": "json_plugin_url"

            });

            var payload = {
                "messages": [{
                    "text": "Which team are you supporting?",
                    "quick_replies": quick_replies
                }]
            };

            res.send(payload);
        });

});


module.exports = router;