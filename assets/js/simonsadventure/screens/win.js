game.WinScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.bg = null;
        this.font = null;
    },
 
    // reset function
    onResetEvent: function() {
        if (this.bg == null) {
            // init stuff if not yet done
            this.bg = me.loader.getImage("win");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32); 
        }
        
        me.audio.stopTrack();
        
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
        context.drawImage(this.bg, 0, 0);
 
        this.font.draw(context, "CONGRATULATIONS!!!", 40, 240);
        this.font.draw(context, "PRESS ENTER \nTO QUIT", 20, 400);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});