
game.gui.Button = game.gui.TextBox.extend({
	
	init: function(options) {
		var defaults = {
				selected: false,
				bgImages: {
					"on": game.gui.getImageFromTexture("bg_hover.png"),
					"off": game.gui.getImageFromTexture("bg.png")
				}
			},
			options = $.extend(defaults, (options || {}));
		
		this.action = options.action;
		this.selected = options.selected;
		
		this.parent($.extend(options, {align: "center middle", frame: true}));
		
		this.bgImages = options.bgImages;
		this.onResetEvent();
	},
	
	clicked: function() {
		if(typeof this.action === 'number' && this.action % 1 == 0)
			me.state.change(this.action);
		else if(typeof this.action === "function")
			this.action();
	},
	
	update: function() {
		return this.active;
	},
	
	draw: function(context) {
		if(this.active) {	
			if(this.containsPointV(me.input.mouse.pos) || this.selected) this.frame.setBgImage(this.bgImages["on"]);
			else this.frame.setBgImage(this.bgImages["off"]);
		}
		
		this.parent(context);
	},
	
	onResetEvent: function() {
		this.active = true;
		me.input.registerPointerEvent("mousedown", this, this.clicked.bind(this));
	},
	
	onDestroyEvent: function() {
		this.active = false;
		me.input.releasePointerEvent("mousedown", this);
	},
	
	select: function(bool) {
		this.select = bool;
	}
});
