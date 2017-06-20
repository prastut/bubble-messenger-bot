var express = require('express');
var router = express.Router();
const helper = require("../helper.js");


router.get('/', function(req, res, next) {

    var response = {}
    Object.assign(response, req.query);
    response.last_timestamp = 0;
    delete response.both;


    res.render('web-view', {
        title: helper.capitalizeFirstLetter(response.channel),
        name: response.channel,
        params: JSON.stringify(response),
        both: JSON.stringify(req.query.both)
    });





});

module.exports = router;