const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");
const path = require('path');
const webshot = require('webshot');



router.get('/', function(req, res, next) {

    var teamResponse = req.query;
    var instance_id = req.query.instance_id;
    var singleOrBoth = teamResponse.channel == "both" ? 2 : 1;

    teamResponse.last_timestamp = 0;

    if (singleOrBoth == 1) {
        var flag = teamResponse.img_url;
        delete teamResponse.img_url;

        request
            .get(helper.getParams('get-index-data', teamResponse), function callBack(err, httpResponse, data) {
                if (err) {
                    res.send([{ "text": "Get Index Data Failed" }]);
                }

                var channel = Object.keys(data)[1 - Object.keys(data).indexOf('instance_id')];
                var keysSorted = Object.keys(data[channel]).map(Number).sort();
                var maxKey = keysSorted[keysSorted.length - 1];

                var neg = data[channel][maxKey].neg;
                var pos = data[channel][maxKey].pos;

                var screenshotUrl = helper.screenshotURL(channel, flag, neg, pos);

                var savePath = path.join('/root/bot/public', 'img', 'screenshot', channel + '-screenshot.jpeg');
                var image_url = String(path.join(helper.ip, 'img', 'screenshot', channel + '-screenshot.jpeg'));
                var title = String(helper.capitalizeFirstLetter(channel));

                var webview_url = helper.webviewURL(channel, instance_id);

                var quick_replies = helper.quickReplies(instance_id);

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
                                        "url": webview_url,
                                        "title": "View More!",
                                        "webview_height_ratio": "tall",

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