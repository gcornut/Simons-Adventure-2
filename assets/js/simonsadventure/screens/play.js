game.PlayScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("lvl1");
        
        // add a default HUD to the game mngr
        me.game.addHUD(0, 430, 640, 60);
 
        // add a new HUD item
        me.game.HUD.addItem("score", new game.ScoreObject(620, 10));
 
        // make sure everything is in the right order
        me.game.sort();
        
        me.audio.stopTrack();
        me.audio.playTrack("bg_game_music");
    },
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD
        //me.game.disableHUD();
	}
});
