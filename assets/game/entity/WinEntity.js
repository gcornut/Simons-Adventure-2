game.entity.WinEntity = me.CollectableEntity.extend({
    init: function(x, y, settings) {
    	settings.image = "winEntity";
        settings.spritewidth = 60;
        settings.spriteheight = 101;
       
        // call the parent constructor
        this.parent(x, y, settings);
    },
    
    onCollision: function() {
 
	    var res = me.game.collide(this);
	    if(res.obj.name == "mainplayer") {
    		// display the game over screen
    		me.state.change(me.state.GAME_END);
    		
    		// remove player
        	me.game.remove(this);
	    }
	    else me.game.remove(res.obj);
    }
});