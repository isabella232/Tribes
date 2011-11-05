function Hud() {
	this.x = 10;
	this.y = 30;		
	this.width = 100;
	this.height = 10;
}
Hud.prototype.render = function () {
	var bar_w = (this.width - 4) * player.fuel;
	view.ctx.strokeRect(this.x, this.y, this.width, this.height);
	view.ctx.fillRect(this.x + 2, this.y + 2, bar_w, this.height - 4);
}
