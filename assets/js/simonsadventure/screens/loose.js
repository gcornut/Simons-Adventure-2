game.LooseScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.bg_image = null;
        
        this.font = null;         
    },
 
    // reset function
    onResetEvent: function() {
    	if(this.bg_image == null) {
	    	this.bg_image = me.loader.getImage("loose");
        
	    	this.font = new me.BitmapFont("32x32_font", 32); 
    	}
    
        me.audio.stopTrack();
        me.audio.playTrack("bg_loose");
        
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true); 
    },
 
    // update function
    update: function() {
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.MENU);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.bg_image, 0, 0);
 
        
        this.font.draw(context, "GAME OVER", 200, 80);
        this.font.draw(context, "PRESS ENTER TO QUIT", 20, 140);
        //this.font.draw(context, "GAME OVER!", 20, 240);
        //this.font.draw(context, me.game.HUD., 20, 272);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});