const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");
const path = require('path');
const webshot = require('webshot');



router.get('/', function(req, res, next) {

    var teamResponse = req.query;
    console.log(teamResponse);
    var singleOrBoth = teamResponse.channel == "both" ? 2 : 1;

    teamResponse.last_timestamp = 0;

    if (singleOrBoth == 1) {
        var flag = teamResponse.img_url;
        delete teamResponse.img_url;

        request
            .get(helper.getParams('get-index-data', teamResponse), function callBack(err, httpResponse, data) {
                if (err) {
                    return console.error('upload failed:', err);
                }

                var channel = Object.keys(data)[1 - Object.keys(data).indexOf('instance_id')];
                var keysSorted = Object.keys(data[channel]).map(Number).sort();
                var maxKey = keysSorted[keysSorted.length - 1];

                // console.log(data);

                var neg = data[channel][maxKey].neg;
                var pos = data[channel][maxKey].pos;

                var screenshotUrl = helper.ip + "screenshot" +
                    "?title=" + channel +
                    "&channel=" + channel +
                    "&flag=" + flag +
                    "&neg=" + neg +
                    "&pos=" + pos;


                var savePath = path.join('/root/bot/public', 'img', 'screenshot', channel + '-screenshot.jpeg');

                console.log(savePath);

                var image_url = path.join(helper.ip, 'img', 'screenshot', channel + '-screenshot.jpeg');

                console.log(image_url);

                webshot(screenshotUrl, savePath, helper.optionsPhone, function(err) {
                    console.log(err);

                    var payload = {
                        "messages": [{
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [{
                                        "title": "2",
                                        "image_url": 'http://www.indiacelebrating.com/wp-content/uploads/indian-Flag.jpg',
                                        "buttons": [{
                                            "type": "web_url",
                                            "url": "http:/139.59.25.186/img/screenshot/india-screenshot.jpeg",
                                            "title": "View Sentiment Analysis"
                                        }]
                                    }]
                                }
                            }
                        }]
                    };

                    res.send(payload);
                    // return payload;
                });

            });

    }
});

module.exports = router;