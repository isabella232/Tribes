function Physics() {
	var world = new b2AABB();
	world.minVertex.Set(0, -500);
	world.maxVertex.Set(2000, 1000);
	var gravity = new b2Vec2(0, 300);
	var doSleep = true;
	this.world = new b2World(world, gravity, doSleep);
}
Physics.prototype.step = function () {
	this.world.Step(Math.min(1 / 20, game.slice / 600), 3);
}
Physics.prototype.circle = function(x, y, r, angle) {
	view.ctx.beginPath();
	view.ctx.arc(x, y, r, 0, Math.PI * 2, true);
	view.ctx.moveTo(x, y);
	view.ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
	view.ctx.stroke();
}
