function Player() {
	this.x = 900;
	this.y = -300;
	// this.sprite = new Layer(config.library + "images/max_sprite.png", 4);
	this.sprite = new Layer(config.library + "images/character_sprite.png", 14);
	this.radius = 8;
	this.flipped = false;
	this.flying = false;
	this.on_ground = false;
	this.fuel = 1.0;

	this.running_right = [1,2,3,4,5,6];
	this.right_frame = 0;
	this.running_left = [7,8,9,10,11,12];
	this.left_frame = 0;

	
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
		this.on_ground = false;
	}
	else {
		this.flying = false;
		if (power === 0 && this.fuel < 1.0) {
			this.fuel += 0.0005 * game.slice;
		}
		var contact = this.body.GetContactList();
		while (!this.on_ground && contact) {
			if (contact.other === view.body) {
				this.on_ground = true;
			}
			contact = contact.next;
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
		this.on_ground = false;
		var contact = this.body.GetContactList();
		while (!this.on_ground && contact) {
			if (contact.other === view.body) {
				this.on_ground = true;
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

	var sprite,
			velocity = this.body.GetAngularVelocity();

	// running right
	if (!this.flipped && this.on_ground) {
		this.right_frame = (this.right_frame >= 5.85) ? 0 : this.right_frame + 0.1;
		sprite = (velocity > 3) ? this.running_right[Math.floor(this.right_frame)] : 0 ;
	}

	// flying right
	else if (!this.on_ground && !this.flipped) {
		sprite = 0;
		this.right_frame = this.left_frame = 0;
	}

	// flying left
	else if (this.flipped && !this.on_ground) {
		sprite = 13;
		this.right_frame = this.left_frame = 0;
	}

	// running left
	else {
		this.left_frame = (this.left_frame >= 5.85) ? 0 : this.left_frame + 0.1;
		sprite = (velocity < -3) ? this.running_left[Math.floor(this.left_frame)] : 13 ;
	}
	
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