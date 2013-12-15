/*----------------
 a note entity
------------------------ */
game.sweetNote = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
    	settings.image = "sweetNote";
        settings.spritewidth = 36;
        settings.spriteheight = 70;
       
        // call the parent constructor
        this.parent(x, y, settings);
        
        this.renderable.addAnimation("stand", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ,18, 19, 20, 21, 22, 23, 24], 2);
        
        this.renderable.setCurrentAnimation("stand");
       	 
        this.anchorPoint.set(0,0);
        
        // make it a enemy object
        this.type = me.game.COLLECTABLE_OBJECT;
    },
 
    update: function() {
	    this.parent();
	    return true;
    },
    
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
    	// give some score
        me.game.HUD.updateItemValue("score", 250);
 
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }
 
});