const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");
const path = require('path');
const webshot = require('webshot');



router.get('/', function(req, res, next) {

    var teamResponse = req.query;
    var instance_id = req.query.instance_id;
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
                var image_url = String(path.join(helper.ip, 'img', 'screenshot', channel + '-screenshot.jpeg'));
                var title = String(helper.capitalizeFirstLetter(channel));

                var webview_url = String(helper.ip + "get-sentiment-analysis" +
                    "?channel=" + channel +
                    "&instance_id=" + instance_id +
                    "&both=" + 0);

                var quick_replies_options = {
                    "follow": "Follow",
                    "trending": "Trending Players",
                    "herozero": "Heros/Zeros",
                    "rival": "Track Rival Team"
                };

                var quick_replies = [];

                for (var key in quick_replies_options) {
                    if (quick_replies_options.hasOwnProperty(key)) {

                        quick_replies.push({
                            "url": helper.ip + "quick-replies?type=" + key + "&instance_id=" + instance_id,
                            "type": "json_plugin_url",
                            "title": quick_replies_options[key]
                        });

                    }
                }


                var payload = {
                    "messages": [{
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "image_aspect_ratio": "square",
                                "elements": [{
                                    "title": title,
                                    "image_url": helper.ip + "img/screenshot/" + channel + '-screenshot.jpeg',
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": "" + webview_url,
                                        "title": "View More!"
                                    }]
                                }]
                            }
                        }
                    }, {
                        "text": "In addition you can do the following as well:",
                        "quick_replies": quick_replies
                    }]
                };


                webshot(screenshotUrl, savePath, helper.optionsPhone, function(err) {
                    console.log(err);
                    res.send(payload);

                });




            });

    }
});

module.exports = router;