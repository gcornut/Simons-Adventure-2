game.gui.screen.PlayScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("lvl1");
        
        // add a default HUD to the game mngr
        //me.game.addHUD(0, 430, 640, 60);
 
        // add a new HUD item
        /*if(me.game.HUD.HUDItems.score != undefined) {
	        me.game.HUD.setItemValue("score", 0);
	        me.game.enableHUD();
        }
        else
        	me.game.HUD.addItem("score", new game.ScoreObject(620, 10));
        */
        
        // make sure everything is in the right order
        me.game.sort();
        
        // enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,	"left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP, "jump", false);
		me.input.bindKey(me.input.KEY.SPACE, "shoot", true);
		
		
        me.audio.stopTrack();
        me.audio.playTrack("bg_game_music");
    },
	
	onDestroyEvent: function() {
		// enable the keyboard
		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.SPACE);
	
		me.audio.stopTrack();
		// remove the HUD
        //me.game.disableHUD();
	}
});
