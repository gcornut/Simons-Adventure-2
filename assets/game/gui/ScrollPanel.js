//@require game.gui.Panel

game.gui.ScrollPanel = game.gui.Panel.extend({

	init: function(options) {
		var defaults = {},
			options = $.extend(defaults, (options || {}));
		this.parent(options);
	},
	
	add: function(component) {
		this.parent();
	},
	
	remove: function(component) {
		this.parent();
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