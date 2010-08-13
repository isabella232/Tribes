function Npc(data) {
	console.log ("new npc with data " + JSON.stringify(data));
	this.data = data;
	this.sprite = player.sprite;
	Npc.list.push(this);
}
Npc.list = [];
Npc.render_all = function() {
	for (var i = 0; i < Npc.list.length; i++) {
		Npc.list[i].render();
	}
}
Npc.get_by_id = function(id) {
	for (var i in Npc.list) {
		if (Npc.list[i].data.id === id) {
			return Npc.list[i];
		}
	}
};
Npc.remove = function(npc) {
	var i = Npc.list.indexOf(npc);
	if(i !== -1) {
		Npc.list.splice(i, 1);
	}
}
Npc.prototype.render = function() {
	this.sprite.draw_other(view.ctx, this.data.sprite, this.data.x + view.fg.x, this.data.y + view.fg.y);
};
