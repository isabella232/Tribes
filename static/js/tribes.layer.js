function Layer(url, sprites) {
	var that = this;
	this.url = url;
	this.width = 0;
	this.height = 0;
	this.x = 0;
	this.y = 0;
	this.sprites = sprites ? sprites : 1;
	this.img = new SmartImage(url, function(img) {
		that.width = ~~(img.width / that.sprites);
		that.height = img.height;
	});
}
Layer.prototype.drawOn = function(context, sprite) {
	// drawImage seems to be faster with larger images than putImageData
	// double bitwise not for fast floor
	this.x = ~~this.x;
	this.y = ~~this.y;
	sprite = sprite ? sprite : 0;
	context.drawImage(this.img.img, this.width * sprite, 0, this.width, this.height, this.x, this.y, this.width, this.height);
};
Layer.prototype.draw_other = function(context, sprite, x, y) {
	sprite = sprite ? sprite: 0;
	context.drawImage(this.img.img, this.width * sprite, 0, this.width, this.height, x, y, this.width, this.height);
};
