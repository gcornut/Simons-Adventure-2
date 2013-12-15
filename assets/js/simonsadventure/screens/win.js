game.WinScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
 
        // title screen image
        this.bg = me.loader.getImage("win");;
 
        this.font = new me.BitmapFont("32x32_font", 32);
    },
 
    /*// reset function
    onResetEvent: function() {
        if (this.bg == null) {
            // init stuff if not yet done
            this.bg = me.loader.getImage("win");
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32); 
        }
        
    },*/
 
    // update function
    update: function() {
        return true;
    },
 
    // draw function
    draw: function(context) {
        context.drawImage(this.bg, 0, 0);
 
        //this.font.draw(context, "CONGRATULATION !!", 40, 240);
        //this.font.draw(context, me.game.HUD., 20, 272);
    },
 
    // destroy function
    onDestroyEvent: function() { }
 
});