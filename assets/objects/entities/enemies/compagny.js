/* --------------------------
an enemy Entity
------------------------ */
game.compagny = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        
        nbCompagnies = 3;
        compagny = Math.floor(Math.random() * nbCompagnies) + 1;
        switch(compagny) {
	        case 1: 
	        	settings.image = "castle";
	        	settings.spritewidth = 25;
	        	settings.spriteheight = 51;
	        	break;
	        case 2: 
	        	settings.image = "helium";
	        	settings.spritewidth = 41;
	        	settings.spriteheight = 42;
	        	break;
	        case 3: 
	        	settings.image = "prizm";
	        	settings.spritewidth = 83;
	        	settings.spriteheight = 41;	
	        	break;
        }
 
        // call the parent constructor
        this.parent(x, y, settings);
        
        if(compagny == 3) this.updateColRect(21, 62, 2, 39);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + (Math.floor(Math.random() * (settings.width - settings.spritewidth)) + 1);
        this.walkLeft = (Math.floor(Math.random() * 2) + 1) == 1;
 
        // walking & jumping speed
        this.setVelocity(2.5, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
            this.renderable.flicker(45);
        }
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not in viewport
        if (!this.inViewport)
            return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
            
            if(this.vel.x == 0) this.walkLeft != this.walkLeft;
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
    }
});