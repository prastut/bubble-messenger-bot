const express = require('express');
const router = express.Router();
const helper = require("../helper.js");


router.get('/', function(req, res, next) {

    var response = {};
    Object.assign(response, req.query);
    response.last_timestamp = 0;
    delete response.both;
    delete response.name;

    console.log(JSON.stringify(response));

    res.render('web-view', {
        title: req.query.name,
        name: response.channel,
        params: JSON.stringify(response),
        both: JSON.stringify(req.query.both)
    });


});

module.exports = router;