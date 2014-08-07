game.entity.mob.Player = me.ObjectEntity.extend({
 
	init: function(x, y, settings) {
		
		this.changes = {};
		this.changes.vel = this.vel;
		this.changes.pos = this.pos;
		this.changes.moved = false;
		
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(5, 18);
		this.updateColRect(18, 32, 12, 52);
		
		this.renderable = game.texture.createAnimationFromName([
			"jump_1.psd",	"jump_2.psd",	"jump_3.psd",
			"stand_1.psd",	"stand_2.psd",	"stand_3.psd", 
			"walk_1.psd",	"walk_2.psd",	"walk_3.psd",	"walk_4.psd"
		]);
		
		this.renderable.addAnimation("stand", ["stand_1.psd", "stand_2.psd"], 300);
		this.renderable.addAnimation("jump", ["jump_1.psd", "jump_2.psd", "jump_3.psd"]);
		this.renderable.addAnimation("walk", ["walk_1.psd", "walk_2.psd", "walk_3.psd", "walk_4.psd"], 50);
		
		this.changeAnimation("stand");
		
		this.anchorPoint.set(0,0);
		//this.ylimit = me.game.currentLevel.height;

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		//me.debug.renderHitBox = true;
		this.alwaysUpdate = true;
		
		this.walkRight = true;
		this.flipX(!this.walkRight);
		
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
		this.life = 1000;
		
	},
	
	changeAnimation: function(animationName) {
		if(!this.renderable.isCurrentAnimation(animationName)) {
			this.renderable.setCurrentAnimation(animationName);
			this.changes.animation = animationName;
		}
	},
 
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
		this.changes.animation = lastChanges.animation;
	
		//socket.emit("action", )
		if (me.input.isKeyPressed('left') || me.input.isKeyPressed('right')) {		
			if(me.input.isKeyPressed('left')) {
				this.walkRight = false;
				
				// update the entity velocity
				this.vel.x -= this.accel.x * me.timer.tick;
			}
			else {
				this.walkRight = true;
				
				// update the entity velocity
				this.vel.x += this.accel.x * me.timer.tick;
			}
			if(!this.jumping && !this.falling)
				this.changeAnimation("walk");
			
			this.flipX(this.walkRight);
			if(lastChanges.walkRight != this.walkRight)
				this.changes.walkRight = this.walkRight;
			
		} else {
			if(!this.jumping && !this.falling)
				this.changeAnimation("stand");
				
			this.parent();
			this.vel.x = 0;
			
		}
		
		if (me.input.isKeyPressed('jump')) {
			this.changeAnimation("jump");
			
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
				if (!this.walkRight) {
					shot = new game.entity.accessory.Bullet(this.pos.x+10, this.pos.y+30, !this.walkRight);
				}
				else {
					shot = new game.entity.accessory.Bullet(this.pos.x+50, this.pos.y+30, !this.walkRight);
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
		
		var pixelAccuracy = 5;
		if(
			Math.floor(this.pos.x/pixelAccuracy) != Math.floor(this.changes.pos.x/pixelAccuracy)
		    || Math.floor(this.pos.y/pixelAccuracy) != Math.floor(this.changes.pos.y/pixelAccuracy)
		    || lastChanges.animation != this.changes.animation
		) {
			this.changes.moved = true;
			this.changes.pos = this.pos;
			
			game.connection.sendMsg("action", this.changes);
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
