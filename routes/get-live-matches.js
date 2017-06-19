const express = require('express');
const request = require('request');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    request
        .get(getParams('get-live-matches', { type: 'cricket-match' }), function callBack(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }

            var elements = [];

            for (var i in liveMatchesData) {

                elements.push({
                    "title": liveMatchesData[i].name,
                    "image_url": liveMatchesData[i].url,
                    "buttons": [{
                        "url": ip + trackingLiveMatchUrl + "?instance_id=" + liveMatchesData[i].instance_id,
                        "title": "Track this!",
                        "type": "json_plugin_url"
                    }]
                });
            }



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