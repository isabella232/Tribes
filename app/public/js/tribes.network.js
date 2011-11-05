function Network() {
	this.socket = io.connect('//');
	this.socket.on('player_update', function(data) {
		var obj = JSON.parse(data);
		var npc = Npc.get_by_id(obj.data.id);

		if (npc) npc.data = obj.data;
		else var new_npc = new Npc(obj.data);
	});

	this.socket.on('game_summary', function(data) {
		var obj = JSON.parse(data);
		player.client_id = obj.new_player_id;
		for (var i in obj.data) {
			var new_player = new Npc(obj.data[i]);
		}
	});

	this.socket.on('player_disconnected', function(data) {
		var obj = JSON.parse(data);
		var dead_npc = Npc.get_by_id(obj.id);
		Npc.remove(dead_npc);
	});

}
Network.prototype.send = function (type, data) {
	this.socket.emit(type, data);
};