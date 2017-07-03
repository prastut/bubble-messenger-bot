const express = require('express');
const router = express.Router();
const helper = require("../../../helper");


router.get('/', function(req, res, next) {

    var response = {};
    Object.assign(response, req.query);
    response.last_timestamp = 0;
    delete response.both;
    delete response.name;

    console.log("GS->" + JSON.stringify(req.query));
    console.log(response);

    res.render('bot-web-view', {
        title: req.query.name,
        channel: JSON.stringify(req.query.channel),
        params: JSON.stringify(response),
    });


});

module.exports = router;