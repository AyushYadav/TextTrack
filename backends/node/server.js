#!/usr/bin/env node

var ot = require('ot');
var express = require('express');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');
var socketIO = require('socket.io');
var path = require('path');
var http = require('http');
var fs = require('fs');

var app = express();
var appServer = http.createServer(app);

app.use(morgan('combined'));
app.use('/', serveStatic(path.join(__dirname, '../../public')));
app.use('/static', serveStatic(path.join(__dirname, '../../public')));
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

var io = socketIO.listen(appServer);

//read file
var str = "# CS 307: System Practicum\n\n"
        + "1. B13136 Samriddhi Jain\n"
        + "2. B13112 Ayush Yadav\n";
        
var socketIOServer = new ot.EditorSocketIOServer(str, [], 'demo', function (socket, cb) {
  cb(!!socket.mayEdit);
});
io.sockets.on('connection', function (socket) {
  socketIOServer.addClient(socket);
  socket.on('login', function (obj) {
    if (typeof obj.name !== 'string') {
      console.error('obj.name is not a string');
      return;
    }
    socket.mayEdit = true;
    socketIOServer.setName(socket, obj.name);
    socket.emit('logged_in', {});
  });
});

var port = process.env.PORT || 8000;
appServer.listen(port, function () {
  console.log("Listening on port " + port);
});

//console.log(getFiles('../ot-demo/backends/node/files'))


process.on('uncaughtException', function (exc) {
  console.error(exc);
});
