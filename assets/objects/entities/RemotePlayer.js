/*------------------- 
a player entity
-------------------------------- */
game.RemotePlayer = me.ObjectEntity.extend({
 
	/* -----
 
	constructor
 
	------ */
 
	init: function(x, y, settings) {
		
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(0, 0);
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
		
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.HORIZONTAL);
		this.life = 1000;
		
		this.walkLeft = true;
		this.flipX(this.walkLeft);
	},
 
	/* -----
	update the player pos
	------ */
	update: function() {
	
		if(Object.keys(remote).length !== 0) {
			changes = remote;
			//if(changes.vel != undefined) this.vel = changes.vel;
			
			if(changes.pos != undefined) this.pos = changes.pos;
			
			if(changes.jumping != undefined) this.jumping = changes.jumping;
			if(changes.walkLeft != undefined) {
			    this.walkLeft = changes.walkLeft;
			    this.flipX(this.walkLeft);
			}
			remote = {};
		}
		
		//this.updateMovement();
		
		this.parent();
		return true;
	}
 
});
