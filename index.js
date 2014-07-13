var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var nextid = 0;
var players = {};

io.on('connection', function(socket){
  socket.on("setup", function(username) {
    players[username] = socket;
  });

  socket.on("move", function(username, x, y) {
    socket.broadcast.emit("move", {username: username, x: x, y: y});
  });

  socket.on('disconnect', function(){
    players[socket] = undefined;
  });

  socket.on('stop', function(username) {
    players[username] = undefined;
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

var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:3000');
});