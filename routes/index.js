var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.send("Hey I am a Bubble Social Chatbot");
});

module.exports = router;