var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var _ = require('lodash');

var players = {};
var playerWithBall;

io.on('connection', function(socket){
  socket.on("setup", function(username) {
    if(playerWithBall === undefined) {
      io.emit("ballposession", username);
      playerWithBall = username;
    } else {
      io.emit("ballposession", playerWithBall);
    }
    players[username] = socket;
  });

  socket.on("move", function(username, x, y) {
    socket.broadcast.emit("move", {username: username, x: x, y: y});
  });

  socket.on("pass", function(to) {
    playerWithBall = to;
    io.emit("ballposession", playerWithBall);
  });

  socket.on('disconnect', function(){
  });

  socket.on('stop', function(username) {
    players[username] = undefined;
    io.emit("leave", username);
  });
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/court.jpg', function(req, res) {
  res.sendfile('court.jpg');
});

app.get('/crap.png', function(req, res) {
  res.sendfile('crap.png');
});

app.get('/ball.jpg', function(req, res) {
  res.sendfile('ball.jpg');
});

var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:3000');
});