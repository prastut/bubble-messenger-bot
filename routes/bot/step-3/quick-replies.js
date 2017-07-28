const express = require('express');
const router = express.Router();
const request = require('request');
const async = require('async');
const helper = require("../../../helper");


router.get('/', function(req, res, next) {

    var type = req.query.type;
    var match_id = req.query.match_id;

    request
        .get(helper.getParams('get-trendings', req.query), function callBack(err, httpResponse, data) {


            var payload,
                elements = [],
                instance_id = data.instance_id,
                i,
                player,
                name,
                web_url,
                quick_replies = helper.quickReplies(match_id, type);

            if (type == "trending") {

                var trendingPlayers = data.trending;


                async.map([...trendingPlayers], fetchplayerDetails, function(err, results) {
                    if (err) {

                    } else {

                        for (i in results) {

                            var player = results[i];

                            elements.push({
                                "title": player.pretty_name,
                                "image_url": player.image_url,
                                "subtitle": "Tweet Count: " + player.tweets_count,
                                "buttons": [{
                                    "type": "web_url",
                                    "url": player.webview,
                                    "title": "View More",
                                    "webview_height_ratio": "tall",
                                }]
                            });

                        }

                        payload = {
                            "messages": [{
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "generic",
                                        "elements": elements
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


            } else if (type == "herozero") {

                var hero = data.heros;
                var zero = data.zeros;

                for (i in hero) {

                    player = Object.keys(hero[i])[0];
                    name = hero[i][player].name;
                    webview_url = helper.webviewURL(player, name, instance_id);

                    elements.push({
                        "title": hero[i][player].name,
                        "image_url": hero[i][player].img_url,
                        "subtitle": "Tweet Count: " + hero[i][player].total_tweets,
                        "buttons": [{
                            "type": "web_url",
                            "url": webview_url,
                            "title": "View More",
                            "webview_height_ratio": "tall",
                        }]
                    });
                }

                for (i in zero) {

                    player = Object.keys(zero[i])[0];
                    name = zero[i][player].name;
                    webview_url = helper.webviewURL(player, name, instance_id);

                    elements.push({
                        "title": zero[i][player].name,
                        "image_url": zero[i][player].img_url,
                        "subtitle": "Tweet Count: " + zero[i][player].total_tweets,
                        "buttons": [{
                            "type": "web_url",
                            "url": webview_url,
                            "title": "View More",
                            "webview_height_ratio": "tall",

                        }]
                    });
                }

                payload = {
                    "messages": [{
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "list",
                                "top_element_style": "compact",
                                "elements": elements
                            }
                        }
                    }, {
                        "text": "In addition you can do the following as well:",
                        "quick_replies": quick_replies
                    }]
                };

            }

            // res.send(payload);
        });


    var fetchplayerDetails = function(playerObj, callBack) {

        request
            .get(helper.getParams('get-player-details', { "player_id": playerObj.id }), function(err, httpResponse, data) {
                if (err) {
                    callBack(err);
                } else {

                    var obj = {

                        'player_id': data.id,
                        'name': data.name,
                        'pretty_name': data.pretty_name,
                        'image_url': data.image_url,
                        'team_id': data.team,
                        'webview': helper.webviewURL(match_id, data.id, "player", data.pretty_name),
                        'tweets_count': playerObj.tweets_count

                    };

                    callBack(null, obj);
                }
            });
    };

});

module.exports = router;