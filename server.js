var http = require("http");
var express = require('express');
var app = express();
var catcher = require('./emails_catcher2.js');


app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(CONFIG.PORT, function () {
    console.log('Example app listening on port 8080!');
    catcher.start();
});
