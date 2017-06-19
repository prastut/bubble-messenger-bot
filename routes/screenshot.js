var express = require('express');
var router = express.Router();
const helper = require("../helper.js");


router.get('/', function(req, res, next) {

    console.log(req.query);

    res.render('screenshot', {
        title: req.query.title,
        name: req.query.channel,
        flag: req.query.flag,
        pos: req.query.pos,
        neg: req.query.neg
    });
});

module.exports = router;




// /screenshot?title=india&pos=12&neg=20&channel=India