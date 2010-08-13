			function View(canvas_id, width, height) {
				this.canvas = document.getElementById(canvas_id);
				this.ctx = this.canvas.getContext('2d');
				this.width = this.canvas.width; //$(this.canvas).attr('width');
				this.height = this.canvas.height; //$(this.canvas).attr('height');
				this.bg = new Layer(config.library + "images/mountains_distant.jpg");
				this.fg = new Layer(config.library + "images/mountains_near.png");
				this.valley_depth = 0;
				this.tx = this.width * .5;
				this.ty = this.height * .5;
				this.target = {x: this.width * .5, y: this.height * .5};
				this.terrain = [];
				this.terrain_resolution = 80;
			}
			View.prototype.follow = function(target) {
				this.target = target;
			};
			View.prototype.update_position = function () {
				this.tx += (this.target.x - this.tx) * .005 * game.slice;
				this.ty += (this.target.y - this.ty) * .005 * game.slice;
				var x_per = this.tx / this.fg.width;
				var y_abs = this.ty - this.valley_depth;
				this.fg.x = (this.width - this.fg.width) * x_per;
				this.fg.y = this.height - this.fg.height - y_abs;
				this.bg.x = (this.width - this.bg.width) * x_per;
				this.bg.y = this.height - this.bg.height - y_abs * .2;
			}
			View.prototype.render = function () {
				this.bg.drawOn(this.ctx);
				this.fg.drawOn(this.ctx);
				
				if (config.debug) {
					game.update_fps();
					this.ctx.fillText("fps: " + game.fps + ", slice: " + game.slice, 10, 20);
					this.ctx.beginPath();
					this.ctx.moveTo(this.terrain[0].x + this.fg.x, this.terrain[0].y + this.fg.y);
					for (var i = 1; i < this.terrain.length; i++) {
						this.ctx.lineTo(this.terrain[i].x + this.fg.x, this.terrain[i].y + this.fg.y);
					}
					this.ctx.stroke();
					for (var i = 0; i < this.terrain.length; i++) {
						physics.circle(this.terrain[i].x + this.fg.x, this.terrain[i].y + this.fg.y, 3, 0);
					}
				}
			};
			View.prototype.plot_terrain = function () {
				var canvas = document.createElement('canvas'),
					ctx,
					image;
				canvas.width = this.fg.width;
				canvas.height = this.fg.height;
				ctx = canvas.getContext('2d');
				
				this.fg.drawOn(ctx);
				image = ctx.getImageData(0, 0, canvas.width, canvas.height);
				var resolution = (image.width - 1) / this.terrain_resolution;
				for (var x = 0; x < image.width; x += resolution) {
					var int_x = ~~x;
					for (var y = 0; y < image.height; y++) {
						var pixel_i = (y * image.width + int_x) * 4;
						var alpha = image.data[pixel_i + 3];
						if (alpha > 0) {
							this.terrain.push({x: int_x, y: y + 2});
							if (y + 2 > this.valley_depth) {
								this.valley_depth = y + 2;
							}
							y = image.height;
						}
					}
				}

				var poly_bd = new b2BodyDef();				
				poly_bd.position.Set(0, 0);

				for (var i = 0; i < this.terrain.length - 1; i++) {
					var poly_sh = new b2PolyDef();
					poly_sh.vertexCount = 4;
					poly_sh.vertices[0].Set(this.terrain[i].x, this.terrain[i].y);
					poly_sh.vertices[1].Set(this.terrain[i + 1].x, this.terrain[i + 1].y);
					poly_sh.vertices[2].Set(this.terrain[i + 1].x, canvas.height);
					poly_sh.vertices[3].Set(this.terrain[i].x, canvas.height);
					poly_sh.restitution = 0.2;
					poly_sh.friction = 1.0;
					poly_bd.AddShape(poly_sh);
				}
				
				/*
				var box_sh = new b2BoxDef();
				box_sh.extents.Set(5, 500);
				box_sh.position = new b2Vec2(10, -500);
				box_sh.restitution = 0.2;
				poly_bd.AddShape(box_sh);
				
				box_sh = new b2BoxDef();
				box_sh.extents.Set(5, 500);
				box_sh.position = new b2Vec2(canvas.width - 10, -500);
				box_sh.restitution = 0.2;
				poly_bd.AddShape(box_sh);
				*/
				
				this.body = physics.world.CreateBody(poly_bd);			
				
			};
