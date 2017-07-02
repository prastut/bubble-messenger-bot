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


            // console.log(data);

            for (var i in data) {

                elements.push({
                    "title": data[i].name,
                    "image_url": data[i].url,
                    "buttons": [{
                        "url": helper.ip + "get-data" + "?instance_id=" + data[0].instance_id,
                        "title": "Track this!",
                        "type": "json_plugin_url"
                    }]
                });
            }


            // console.log(elements);

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