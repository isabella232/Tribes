var io, game, json;

function Game() {}

Game.prototype.init = function(server) {
  this.players = [];

  json = JSON.stringify;
  io = require('socket.io').listen(server);
  game = this;


  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.set('transports', [                     // enable all transports (optional if you want flashsocket)
      'websocket',
      'flashsocket',
      'htmlfile',
      'xhr-polling'
  ]);
  
  io.set('log level', 1);

  io.sockets.on('connection', function(socket) {
    game.summarize_for(socket);
    game.add_player(new Player(socket));

    socket.on('player_sync', function(data) {
      socket.broadcast.emit('player_update', data);
    });
    
  });
};

Game.prototype.summarize_for = function(client) {
  var summary = {
    new_player_id: client.sessionId,
    data: []
  };
  for(var i in this.players) {
    summary.data.push(this.players[i].data);
  }
  client.broadcast.emit('game_summary', json(summary));
};


Game.prototype.add_player = function(player) {
  this.players.push(player);
  player.socket.broadcast.emit('player_connected', json({
    id: player.data.id
  }));
};

Game.prototype.remove_player = function(player) {
  player.socket.broadcast.emit('player_disconnected', json({
    id: player.data.id
  }));
  this.players.splice(this.players.indexOf(player), 1);
};

function Player(socket) {
  var that = this;
  this.socket = socket;
  this.data = {
    id: socket.id,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    sprite: 0
  };
  socket.on('disconnect', function() {
    game.remove_player(that);
  });
}

exports = module.exports = new Game();