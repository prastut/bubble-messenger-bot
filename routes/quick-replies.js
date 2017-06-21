const express = require('express');
const router = express.Router();
const request = require('request');
const helper = require("../helper.js");


router.get('/', function(req, res, next) {

    var response = req.query;
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
                    web_url;

                if (type == "trending") {

                    var trendingPlayers = data.trending;

                    for (i in trendingPlayers) {

                        player = Object.keys(trendingPlayers[i])[0];
                        webview_url = helper.ip + "get-sentiment-analysis" +
                            "?channel=" + player +
                            "&instance_id=" + instance_id +
                            "&both=0";


                        elements.push({
                            "title": trendingPlayers[i][player].name,
                            "image_url": trendingPlayers[i][player].img_url,
                            "subtitle": "Tweet Count: " + trendingPlayers[i][player].total_tweets,
                            "buttons": [{
                                "type": "web_url",
                                "url": webview_url,
                                "title": "View More"

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
                        }]
                    };

                } else if (type == "herozero") {

                    var hero = data.heros;
                    var zero = data.zeros;



                    for (i in hero) {

                        player = Object.keys(hero[i])[0];
                        webview_url = helper.ip + "get-sentiment-analysis" +
                            "?channel=" + player +
                            "&instance_id=" + instance_id +
                            "&both=0";


                        elements.push({
                            "title": hero[i][player].name,
                            "image_url": hero[i][player].img_url,
                            "subtitle": "Tweet Count: " + hero[i][player].total_tweets,
                            "buttons": [{
                                "type": "web_url",
                                "url": webview_url,
                                "title": "View More"

                            }]
                        });
                    }

                    for (i in zero) {

                        player = Object.keys(zero[i])[0];
                        webview_url = helper.ip + "get-sentiment-analysis" +
                            "?channel=" + player +
                            "&instance_id=" + instance_id +
                            "&both=0";


                        elements.push({
                            "title": zero[i][player].name,
                            "image_url": zero[i][player].img_url,
                            "subtitle": "Tweet Count: " + zero[i][player].total_tweets,
                            "buttons": [{
                                "type": "web_url",
                                "url": webview_url,
                                "title": "View More"

                            }]
                        });
                    }

                    payload = {
                        "messages": [{
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "list",
                                    "top_element_style": "large",
                                    "elements": elements
                                }
                            }
                        }]
                    };

                }


                res.send(payload);


            });


    } else if (type == "rival") {

    }

});

module.exports = router;