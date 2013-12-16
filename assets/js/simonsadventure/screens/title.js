game.TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.title = null;
 
        this.font = null;
    },
 
    // reset function
    onResetEvent: function() {
        me.audio.stopTrack();
        me.game.disableHUD();
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32); 
        }
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true); 
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
 
        this.font.draw(context, "PRESS ENTER \n       TO PLAY", 150, 200);
        this.font.draw(context, "ARROWS: MOVE", 20, 400);
        this.font.draw(context, "SPACE: SHOOT", 20, 440);
    },
 
    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
 
});