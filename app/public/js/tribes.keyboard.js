function Keyboard() {
	var that = this;
	
	this.map = {'38':'up', '39':'right', '40':'down', '37':'left', '87':'up', '68':'right', '83':'down', '65':'left', '32':'space'};

	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.space = false;
	
	$(document).keydown(function (event) {
		if (that.map[event.which]) {
			that[that.map[event.which]] = true;
		}
		else if (event.which == 73) {
			config.debug = !config.debug;
		}
		else if (debug) {
			console.log("Keycode: " + event.which);
		}
		return false;
	});
	
	$(document).keyup(function (event) {
		if (that.map[event.which]) {
			that[that.map[event.which]] = false;
		}
	});	
}
