function Network() {
	io.setPath('/client/');
	this.socket = new io.Socket(null, {port: 3000});
	this.socket.connect();
	this.socket.on('message', this.receive);
}
Network.prototype.send = function (data) {
	this.socket.send(data);
};
Network.prototype.receive = function (data) {
	var obj = JSON.parse(data);
	if (obj.type === 'player update') {
		var npc = Npc.get_by_id(obj.data.id);
		if (npc) {
			npc.data = obj.data;
		}
		else {
			var new_npc = new Npc(obj.data);
		}
	}
	else if (obj.type === 'game summary') {
		player.client_id = obj.new_player_id;
		for (var i in obj.data) {
			var new_player = new Npc(obj.data[i]);
		}
	}
	else if (obj.type === 'player disconnected') {
		var dead_npc = Npc.get_by_id(obj.id);
		Npc.remove(dead_npc);
	}
};