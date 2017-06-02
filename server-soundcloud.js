var http = require("http");
var express = require('express');
var app = express();
var catcher = require('./email_catcher.js');


app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(process.env["PORT"], function () {
    console.log('Example app listening on port 8080!');
    catcher.init(function(){
        catcher.start(function(){
            console.log("END");
        });
    });
});
