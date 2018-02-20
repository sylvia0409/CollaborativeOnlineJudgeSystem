var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds241668.mlab.com:41668/problems');

var restRouter = require('./routes/rest.js');

app.use('/api/v1', restRouter);

app.listen(3000, function() {
     console.log('Example app listening on port 3000!')
    })