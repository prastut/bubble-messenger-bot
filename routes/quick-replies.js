var express = require('express');
var router = express.Router();
const helper = require("../helper.js");


router.get('/', function(req, res, next) {

    var type = req.query.type;

    res.send([{ "text": type }]);

});

module.exports = router;