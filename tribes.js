var express = require('express'),
    connect = require('connect'),
	io = require('socket.io');

		
// Create and export Express app
var app = express.createServer();

app.set('development');

// Configuration
app.use(connect.bodyDecoder());
app.use(connect.methodOverride());
//app.use(connect.gzip());
app.use(connect.compiler({ src: __dirname + '/static', enable: ['sass'] }));
app.use(connect.staticProvider(__dirname + '/static'));

app.configure('development', function(){
    app.set('reload views', 1000);
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});


// Routes

app.get('/', function(req, res) {
	res.redirect('/index.html');
});

app.listen(3000);


// DEMO
// Socket.IO

function Game() {
	this.players = [];
}
Game.prototype.summarize_for = function(client) {
	var summary = {
		type: 'game summary',
		new_player_id: client.sessionId,
		data: []
	};
	for(var i in this.players) {
		summary.data.push(this.players[i].data);
	}
	client.send(json(summary));
};
Game.prototype.add_player = function(player) {
	this.players.push(player);
	player.client.broadcast(json({
		type: 'player connected',
		id: player.data.id
	}));
}
Game.prototype.remove_player = function(player) {
	player.client.broadcast(json({
		type: 'player disconnected',
		id: player.data.id
	}));
	this.players.splice(this.players.indexOf(player), 1);
}

function Player(id, client) {
	var that = this;
	this.client = client;
	this.data = {
		id: id,
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		sprite: 0
	};
	client.on('message', function(data) {
		var obj = JSON.parse(data);
		if (obj.type === 'player sync') {
			that.data = obj.data;
			client.broadcast(json({
				type: 'player update',
				data: that.data
			}));
		}
	});
	client.on('disconnect', function() {
		game.remove_player(that);
	});
}

var json = JSON.stringify,
	io = io.listen(app),
	game = new Game();

io.on('connection', function(client) {
	game.summarize_for(client);
	game.add_player(new Player(client.sessionId, client));
});


