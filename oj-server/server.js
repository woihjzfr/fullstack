var express = require('express')
var app = express()
var restRouter = require("./routes/rest");
var indexRouter = require("./routes/index");
var mongoose = require("mongoose");
var path = require("path");
var http = require('http');

var socket_io = require('socket.io');
var io = socket_io();
var socketService = require('./services/SocketService.js')(io);
// mongodb://<dbuser>:<dbpassword>@ds229290.mlab.com:29290/szc
// mongoose.connect("mongodb://user:user@ds129030.mlab.com:29030/coj-song");
mongoose.connect("mongodb://woihjzfr:a4835561@ds229290.mlab.com:29290/szc");

app.use(express.static(path.join(__dirname, '../public')));
app.use("/", indexRouter);
app.use("/api/v1", restRouter);

//handle all other url requests
app.use(function (req, res) {
  //send index.html to start client side
  res.sendFile("index.html", {root: path.join(__dirname, '../public/')});
});

var server = http.createServer(app);
io.attach(server);
server.listen(3000);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  throw error;
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr == 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
