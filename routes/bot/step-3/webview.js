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

    res.render('web-view', {
        title: req.query.name,
        name: req.query.name,
        nameforJS: JSON.stringify(req.query.name),
        params: JSON.stringify(response),
        both: JSON.stringify(req.query.both),

    });


});

module.exports = router;