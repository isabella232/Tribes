function Game() {
	this.target_fps = 60;	// 80 seems to be the max Chrome can handle
	this.frame = 0;
	this.slice = 0;		// Current time slice
	this.tick = 0;
	this.fps = 0;
	this.fps_lastframe = 0;
	this.fps_lasttick = 0;
}
Game.get_tick = function () {
	return new Date().getTime();
};
Game.prototype.update_fps = function () {
	var frame_difference = this.frame - this.fps_lastframe;
	if (frame_difference > this.target_fps) {
		this.fps = ~~((frame_difference / (this.tick - this.fps_lasttick)) * 1000);
		this.fps_lastframe = this.frame;
		this.fps_lasttick = this.tick;
	}
};
Game.prototype.update_slice = function () {
	var tick = Game.get_tick();
	this.slice = tick - this.tick;
	this.tick = tick;
};
Game.prototype.start = function() {	
	this.tick = Game.get_tick();
};