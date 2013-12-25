/*----------------
 a note entity
------------------------ */
game.coin = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
    	settings.image = "coin";
        settings.spritewidth = 32;
        settings.spriteheight = 32;
       
        // call the parent constructor
        this.parent(x, y, settings);
        
        //this.anchorPoint.set(0,0);
        
        // make it a enemy object
        this.type = me.game.COLLECTABLE_OBJECT;
        
        this.collidable = true;
    },
 
    update: function() {
	    this.parent();
	    return true;
    },
    
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
    	// give some score
        //me.game.HUD.updateItemValue("score", 250);
        me.audio.play("coin");
 
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
    }
 
});