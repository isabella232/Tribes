var game = new Game();
var physics = new Physics();
var view = new View("view");
var player = new Player();
var keyboard = new Keyboard();
var hud = new Hud();
var network = new Network();

function main() {
	// Calculate the "time slice" we're manipulating this loop
	game.update_slice();
	
	// Handle player input
	player.keyboardInput(keyboard);
	
	// Update game object positions
	player.checkBounds();
	physics.step();
	
	// Update view
	view.update_position();
	
	// Draw
	view.render();
	Npc.render_all();
	player.render();
	hud.render();
	
	// Sync with the server
	player.sync();
	
	// Just finished a frame
	game.frame += 1;
}

SmartImage.loadAll(function () {
	console.log("loadAll");
	view.plot_terrain();
	view.follow(player);

	game.start();
	
	setInterval(main, 1000 / game.target_fps);
});
