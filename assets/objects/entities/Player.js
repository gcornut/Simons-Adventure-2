/*------------------- 
a player entity
-------------------------------- */
game.Player = me.ObjectEntity.extend({
 
	/* -----
 
	constructor
 
	------ */
 
	init: function(x, y, settings) {
		
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(5, 18);
		this.updateColRect(18, 32, 12, 52);
		
		this.renderable.addAnimation("stand", [0, 1, 2], 30);
		this.renderable.addAnimation("jump", [4, 5, 6]);
		this.renderable.addAnimation("walk", [8, 9, 10, 11], 10);
		
		this.renderable.setCurrentAnimation("stand");
	   	 
		this.anchorPoint.set(0,0);
		//this.ylimit = me.game.currentLevel.height;

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		//me.debug.renderHitBox = true;
		this.alwaysUpdate = true;
		
		this.walkLeft = true;
		this.flipX(this.walkLeft);
		
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
		this.life = 1000;
		
		this.changes = {};
		this.changes.vel = this.vel;
		this.changes.moved = false;
	},
 
	/* -----
	update the player pos
	------ */
	update: function() {
		var lastChanges = this.changes;
		this.changes = {};
		this.changes.pos = {};
		this.changes.pos.x = this.pos.x;
		this.changes.pos.y = this.pos.y;
		this.changes.vel = {};
		this.changes.vel.x = this.vel.x;
		this.changes.vel.y = this.vel.y;
		this.changes.moved = false;
	
		//socket.emit("action", )
		if (me.input.isKeyPressed('left') || me.input.isKeyPressed('right')) {		
			if(me.input.isKeyPressed('left')) {
				if(!this.jumping && !this.falling)
				this.renderable.setCurrentAnimation("walk");
		
				this.walkLeft = true;
				this.flipX(this.walkLeft);
				
				// update the entity velocity
				this.vel.x -= this.accel.x * me.timer.tick;
			}
			else {			
				if(!this.jumping && !this.falling)
					this.renderable.setCurrentAnimation("walk");
		
				this.walkLeft = false;
				this.flipX(this.walkLeft);
				
				// update the entity velocity
				this.vel.x += this.accel.x * me.timer.tick;
			}
			
			if(lastChanges.walkLeft != this.walkLeft)
				this.changes.walkLeft = this.walkLeft;
			
		} else {
			if(!this.jumping && !this.falling)
				this.renderable.setCurrentAnimation("stand");
			this.parent();
			this.vel.x = 0;
			
		}
		
		if (me.input.isKeyPressed('jump')) {
			this.renderable.setCurrentAnimation("jump");
			
			// make sure we are not already jumping or falling
			if (!this.jumping && !this.falling) {
				
				// set current vel to the maximum defined value
				// gravity will then do the rest
				this.vel.y = -this.maxVel.y * me.timer.tick;
				// set the jumping flag
				this.jumping = true;
				
				// play some audio 
				me.audio.play("jump");
				
				this.changes.jumping = this.jumping;
			}
 
		}
		
		if (me.input.isKeyPressed('shoot')) {
			for(var i = 1; i <= (Math.floor(Math.random() * 2) + 1); i++) {
				if (this.walkLeft) {
					shot = new bullet(this.pos.x+10, this.pos.y+30, this.walkLeft);
				}
				else {
					shot = new bullet(this.pos.x+50, this.pos.y+30, this.walkLeft);
				}
				me.game.add(shot, this.z);
			}
			me.game.sort();
			//me.game.HUD.updateItemValue("score", -1);
		}
 
		// check & update player movement
		this.updateMovement();
		
		// check for collision
		var res = me.game.collide(this);
	 
		if (res) {
			// if we collide with an enemy
			if (res.obj.type == me.game.ENEMY_OBJECT) {
				// check if we jumped on it
				if ((res.y > 0) && ! this.jumping) {
					// bounce (force jump)
					this.falling = false;
					this.vel.y = -this.maxVel.y * me.timer.tick;
					// set the jumping flag
					this.jumping = true;
					
					// remove enemy if jump on it
					me.game.remove(res.obj);
	 
				} else {
					// let's flicker in case we touched an enemy
					
					this.life -= 20;
					if (this.life <= 0) {
						
					   // display the game over screen
				 	   me.state.change(me.state.GAMEOVER);
				 	   // remove the player
				 	   me.game.remove(this);
					}
					this.renderable.flicker(45);
				}
			}
		}
		
		/*if(this.vel.x != this.changes.vel.x || this.vel.y != this.changes.vel.y) {
			this.changes.moved = true;
			this.changes.vel = this.vel;
			
			socket.emit("action", this.changes);
		}*/
		
		var pixelAccuracy = 5;
		if(
			Math.floor(this.pos.x/5) != Math.floor(this.changes.pos.x/5)
		    || Math.floor(this.pos.y/5) != Math.floor(this.changes.pos.y/5)
		) {
			this.changes.moved = true;
			this.changes.pos = this.pos;
			
			if(connection.isOpened())
				connection.sendJSON(this.changes, "action");
		}
		
		// update animation if necessary
		//if (this.vel.x!=0 || this.vel.y!=0) {
			// update object animation
			this.parent();
			return true;
		//}
		 
		// else inform the engine we did not perform
		// any update (e.g. position, animation)
		//return false;
	}
 
});
