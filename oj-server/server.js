var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds241668.mlab.com:41668/problems');

var indexRouter = require('./routes/index.js');
var restRouter = require('./routes/rest.js');
var path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use('/', indexRouter);
app.use('/api/v1', restRouter);
app.use(function(req, res, next){
    res.sendFile('index.html', {root: path.join(__dirname,'../public')});
})

var http = require('http');
var socketIO = require('socket.io');
var io = socketIO();

var editorSocketService = require('./services/editorSocketService.js')(io);
var server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

function onError(error){
    throw error;
}
function onListening(){
    var addr = server.address;
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on' + bind); 
}