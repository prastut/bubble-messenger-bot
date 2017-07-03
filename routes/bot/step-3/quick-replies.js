const express = require('express');
const router = express.Router();
const request = require('request');
const helper = require("../../../helper");


router.get('/', function(req, res, next) {

    var response = {};
    Object.assign(response, req.query);
    var type = response.type;
    delete response.type;





    if (type == "trending" || type == "herozero") {

        request
            .get(helper.getParams('get-trending-players', response), function callBack(err, httpResponse, data) {

                var payload,
                    elements = [],
                    instance_id = data.instance_id,
                    i,
                    player,
                    name,
                    web_url,
                    quick_replies = helper.quickReplies(instance_id, type);

                if (type == "trending") {

                    var trendingPlayers = data.trending;

                    for (i in trendingPlayers) {

                        player = Object.keys(trendingPlayers[i])[0];
                        name = trendingPlayers[i][player].name;
                        webview_url = helper.webviewURL(player, name, instance_id);

                        elements.push({
                            "title": trendingPlayers[i][player].name,
                            "image_url": trendingPlayers[i][player].img_url,
                            "subtitle": "Tweet Count: " + trendingPlayers[i][player].total_tweets,
                            "buttons": [{
                                "type": "web_url",
                                "url": webview_url,
                                "title": "View More",
                                "webview_height_ratio": "tall"
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

                res.send(payload);
            });


    } else if (type == "rival") {

    }

});

module.exports = router;