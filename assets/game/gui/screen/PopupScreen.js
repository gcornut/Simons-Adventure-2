game.gui.screen.PopupScreen = game.gui.screen.ComplexScreen.extend({
	
	init: function() {
		
	},
	
	onResetEvent: function() {
		this.parent();
	},
 
	onDestroyEvent: function() {
		this.parent();
	},
 
	draw: function(context) {
		this.parent(context);
	}
});