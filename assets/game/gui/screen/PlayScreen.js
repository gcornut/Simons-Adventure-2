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
        
        me.audio.stopTrack();
        me.audio.playTrack("bg_game_music");
    },
	
	onDestroyEvent: function() {
		me.audio.stopTrack();
		// remove the HUD
        //me.game.disableHUD();
	}
});