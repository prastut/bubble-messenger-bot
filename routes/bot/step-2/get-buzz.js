const express = require('express');
const request = require('request');
const async = require('async');
const helper = require("../../../helper");
const path = require('path');
const webshot = require('webshot');
const router = express.Router();


router.get('/', function(req, res, next) {

    var instance_id = req.query.instance_id;


    request
        .get(helper.getParams('teams', req.query), function callBack(err, httpResponse, data) {
            if (err) {
                res.send([{ "text": "Get Index Data Failed" }]);
            }

            var teams = Object.keys(data.teams);
            var teamsObject = teams.map(function(i) {
                return {
                    instance_id: instance_id,
                    channel: i
                };
            });

            async.map([teamsObject[0], teamsObject[1]], fetch, function(err, results) {
                if (err) {

                } else {
                    var i;
                    var url = urlmaker(results, teams, instance_id);

                    var screenshotRequests = [];
                    for (i in teams) {

                        screenshotRequests.push(url[teams[i]]);

                    }

                    async.map(screenshotRequests, clickPhotu, function(err, results) {
                        if (err) {
                            console.log(err);

                        } else {

                            var quick_replies = helper.quickReplies(instance_id);
                            var elements = [];
                            for (i in teams) {

                                elements.push({
                                    "title": teams[i],
                                    "image_url": "https:/bubble.social/img/screenshot/chile-screenshot-6.jpeg",
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": "https:/bubble.social/img/screenshot/chile-screenshot-6.jpeg",
                                        "title": "View More!",
                                        "webview_height_ratio": "tall",

                                    }]
                                });
                            }

                            var payload = {
                                "messages": [{
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "generic",
                                            "image_aspect_ratio": "square",
                                            "elements": [{
                                                "title": "title",
                                                "image_url": helper.ip + "img/screenshot/" + teams[0] + '-screenshot-' + 6 + '.jpeg',
                                                "buttons": [{
                                                    "type": "web_url",
                                                    "url": "https://www.google.com",
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

                            res.send(payload);
                        }
                    });
                }
            });
        });


});




var clickPhotu = function(team, callBack) {


    webshot(
        team.screenshot,
        team.savepath,
        helper.optionsPhone,
        function(err) {
            callBack(err);
        });

};


var urlmaker = function(results, teams, instance_id) {

    var date = new Date().getDate();
    var obj = {};

    results.map(function(val, i) {
        var team = teams[i];
        var neg = val[team].neg;
        var pos = val[team].pos;

        var nameOfImg = team + '-screenshot-' + date + '.jpeg';


        obj[team] = {
            'screenshot': helper.screenshotURL(team, "flag", neg, pos),
            'savepath': path.join(path.resolve("."), 'public/img/screenshot', nameOfImg),
            'image_url': path.join(helper.ip, 'img/screenshot', nameOfImg),
            'webview': helper.webviewURL(instance_id, teams[i])
        };

    });

    return obj;
};

var fetch = function(team, callBack) {

    team.start_timestamp = -1;

    request
        .get(helper.getParams('get-index-data', team), function(err, httpResponse, data) {
            if (err) {
                callBack(err);
            } else {
                callBack(null, data);
            }
        });
};

module.exports = router;