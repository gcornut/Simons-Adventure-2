
/* Game namespace */
var game = {
	// Run on page load.
	"onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen", 640, 480, true, 'auto')) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}
		
		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);
	 
		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	},

	// Run on game resources loaded.
	"loaded" : function ()
	{
		me.state.set(me.state.MENU, new game.TitleScreen());
		
		
		me.state.set(me.state.GAME_END, new game.WinScreen());
		
		me.state.set(me.state.GAMEOVER, new game.LooseScreen());
		
		
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new game.PlayScreen());
		  
		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", game.PlayerEntity);
		me.entityPool.add("compagny", game.compagny);
		me.entityPool.add("coin", game.coin);
		me.entityPool.add("winEntity", game.winEntity);
				  
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.UP,	"jump", false);
		me.input.bindKey(me.input.KEY.SPACE, "shoot", true);
		
		// set a global fading transition for the screen
		me.state.transition("fade", "#000000", 250);
		
		// start the game 
		me.state.change(me.state.GAME_END);
	}
};
