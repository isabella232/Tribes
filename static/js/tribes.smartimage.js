function SmartImage(src, callback) {
	var that = this;
	this.img = new Image();
	this.src = src;		
	this.callback = callback;
	this.img.onload = function () {
		that.callback(that.img);
		SmartImage.just_loaded(that);
	};
	this.img.onerror = function () {
		console.log("Error: Couldn't load image " + this.src);
	}
	SmartImage.image_list.push(this);
}
SmartImage.image_list = [];
SmartImage.loaded = 0;
SmartImage.just_loaded = function(smart_image) {
	SmartImage.loaded += 1;
	if (SmartImage.loaded === SmartImage.image_list.length) {
		SmartImage.callback();
	}
};
SmartImage.loadAll = function(callback) {
	SmartImage.callback = callback;
	for (var i = 0; i < SmartImage.image_list.length; i++) {
		SmartImage.image_list[i].img.src = SmartImage.image_list[i].src;
	}
}
