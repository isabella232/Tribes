function Player() {
	this.x = 900;
	this.y = -300;
	this.sprite = new Layer(config.library + "images/max_sprite.png", 4);
	this.radius = 8;
	this.flipped = false;
	this.flying = false;
	this.fuel = 1.0;
	
	var circle = new b2CircleDef();
	circle.density = 0.25;
	circle.restitution = -0.1;
	circle.radius = this.radius;
	circle.friction = 1.0;
	
	var body = new b2BodyDef();
	body.AddShape(circle);
	body.position.Set(this.x, this.y);
	body.angularDamping = 0.7;
	body.linearDamping = 0.01;
	body.allowSleep = false;
	
	this.body = physics.world.CreateBody(body);
}
Player.prototype.walk = function(dx) {
	if (this.flying) {
		var v = this.body.GetLinearVelocity();
		v.Add(new b2Vec2(dx * 0.05, 0));
	}
	var av = this.body.GetAngularVelocity();
	this.body.SetAngularVelocity(av + dx);
	this.flipped = Boolean(dx < 0);
};
Player.prototype.jump = function(power) {
	this.body.ApplyImpulse(new b2Vec2(0, -power), this.body.GetCenterPosition());
};
Player.prototype.fly = function(power) {
	if (power > 0 && this.fuel > 0) {
		this.body.ApplyForce(new b2Vec2(0, -power), this.body.GetCenterPosition());
		this.fuel -= 0.0005 * game.slice;
		this.flying = true;
	}
	else {
		this.flying = false;
		if (power === 0 && this.fuel < 1.0) {
			this.fuel += 0.0005 * game.slice;
		}
	}
};
Player.prototype.keyboardInput = function(kb) {
	var force = new b2Vec2(0, 0);
	if (kb.up && !kb.down) {
		
	}
	else if (kb.down && !kb.up) {
		//this.y += .3 * game.slice;
	}
	if (kb.left && !kb.right) {
		this.walk(-50);
	}
	else if (kb.right && !kb.left) {
		this.walk(50);
	}
	if (kb.space) {
		var on_ground = false;
		var contact = this.body.GetContactList();
		while (!on_ground && contact) {
			if (contact.other === view.body) {
				on_ground = true;
			}
			contact = contact.next;
		}
		if (on_ground) {
			this.jump(2000);
		}
	}
	if (kb.up) {
		this.fly(20000);
	}
	else {
		this.fly(0);
	}
};
Player.prototype.checkBounds = function () {
	return;
};
Player.prototype.render = function () {
	this.x = this.body.m_position.x;
	this.y = this.body.m_position.y;

	this.sprite.x = view.fg.x + this.x - this.sprite.width * 0.5;
	this.sprite.y = view.fg.y + this.y - (this.sprite.height - this.radius);
	
	var sprite;
	if (!this.flipped && !this.flying)
		sprite = 0;
	else if (this.flying && !this.flipped)
		sprite = 1;
	else if (this.flipped && this.flying)
		sprite = 2;
	else
		sprite = 3;
	
	this.current_sprite = sprite;
	this.sprite.drawOn(view.ctx, sprite);
	
	if (config.debug) {
		physics.circle(this.x + view.fg.x, this.y + view.fg.y, this.radius, this.body.GetRotation());
	}
};
Player.prototype.sync = function() {
	network.send('player_sync', JSON.stringify({
		data: {
			id: this.client_id,
			x: this.sprite.x - view.fg.x,
			y: this.sprite.y - view.fg.y,
			dx: 0,
			dy: 0,
			sprite: this.current_sprite
		}
	}));
};