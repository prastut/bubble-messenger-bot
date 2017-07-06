const express = require('express');
const router = express.Router();
const helper = require("../../../helper");


router.get('/', function(req, res, next) {

    var response = {};
    Object.assign(response, req.query);
    delete response.both;
    delete response.name;


    res.render('bot-web-view', {
        title: req.query.name,
        channel: JSON.stringify(req.query.channel),
        params: JSON.stringify(response),
    });


});

module.exports = router;