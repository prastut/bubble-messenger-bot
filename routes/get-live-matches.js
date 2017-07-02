const express = require('express');
const request = require('request');
const router = express.Router();
const helper = require("../helper.js");
/* GET home page. */

router.get('/', function(req, res, next) {

    request
        .get(helper.getParams('get-live-matches', { type: 'cricket-match' }), function callBack(err, httpResponse, data) {
            if (err) {
                return console.error('upload failed:', err);
            }

            var elements = [];
            // console.log(data);

            for (var i in data) {

                request
                    .get(helper.getParams('teams', { instance_id: data[i].instance_id }),
                        function callBack(err, httpResponse, match) {

                            var teamsOfMatch = Object.keys(match.teams);
                            var title = helper.capitalizeFirstLetter(teamsOfMatch[0]) +
                                ' vs ' +
                                helper.capitalizeFirstLetter(teamsOfMatch[1]);

                            elements.push({
                                "title": title,
                                "image_url": data[i].url,
                                "subtitle": data[i].name,
                                "buttons": [{
                                    "url": helper.ip + "get-data" + "?instance_id=" + data[i].instance_id,
                                    "title": "Track this!",
                                    "type": "json_plugin_url"
                                }]
                            });
                        });

            }

            console.log(elements);

            var liveData = {
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


            res.send(liveData);
        });


});


module.exports = router;