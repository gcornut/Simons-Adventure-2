/*----------------
 a note entity
------------------------ */
game.winEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
    	settings.image = "winEntity";
        settings.spritewidth = 60;
        settings.spriteheight = 101;
       
        // call the parent constructor
        this.parent(x, y, settings);
    },
    
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
 
	    var res = me.game.collide(this);
	    if(res.obj.name == "mainPlayer") {
    		// display the game over screen
    		me.state.change(me.state.GAME_END);
    		
    		// remove player
        	me.game.remove(this);
	    }
    }
 
});