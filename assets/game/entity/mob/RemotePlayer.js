game.entity.mob.RemotePlayer = me.ObjectEntity.extend({
 
	init: function(x, y, settings) {
		
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(0, 0);
		this.updateColRect(18, 32, 12, 52);
		
		this.renderable = game.texture.createAnimationFromName([
			"jump_1.psd",	"jump_2.psd",	"jump_3.psd",
			"stand_1.psd",	"stand_2.psd",	"stand_3.psd", 
			"walk_1.psd",	"walk_2.psd",	"walk_3.psd",	"walk_4.psd"
		]);
		
		this.renderable.addAnimation("stand", ["stand_1.psd", "stand_2.psd"], 300);
		this.renderable.addAnimation("jump", ["jump_1.psd", "jump_2.psd", "jump_3.psd"]);
		this.renderable.addAnimation("walk", ["walk_1.psd", "walk_2.psd", "walk_3.psd", "walk_4.psd"], 50);

		this.renderable.setCurrentAnimation("stand");
	   	 
		this.anchorPoint.set(0,0);
		//this.ylimit = me.game.currentLevel.height;

		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		//me.debug.renderHitBox = true;
		this.alwaysUpdate = true;
		
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
		this.life = 1000;
		
		this.walkRight = false;
		this.flipX(!this.walkRight);
	},
	
	changeAnimation: function(animationName) {
		if(!this.renderable.isCurrentAnimation(animationName)) {
			this.renderable.setCurrentAnimation(animationName);
		}
	},
	
	update: function() {
	
		if(Object.keys(game.connection.remote).length !== 0) {
			changes = game.connection.remote;
			//if(changes.vel != undefined) this.vel = changes.vel;
			
			if(changes.pos != undefined) this.pos = changes.pos;
			
			if(changes.jumping != undefined) this.jumping = changes.jumping;
			if(changes.walkRight != undefined) {
			    this.walkRight = changes.walkRight;
			    this.flipX(this.walkRight);
			}
			if(changes.animation != undefined) {
			    this.changeAnimation(changes.animation);
			}
			game.connection.remote = {};
		}
		
		//this.updateMovement();
		
		this.parent();
		return true;
	}
 
});
