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
		
		this.selectionHandler = options.selectionHandler;
		this.action = options.action;
		this.selected = options.selected;
		
		this.parent($.extend(options, {align: "center middle", frame: true}));
		
		this.selectAnim = new game.gui.Animation({from: 0.8, to: 1, sec: 0.5});
		
		this.bgImages = options.bgImages;
		this.onResetEvent();
	},
	
	clicked: function() {
		if(typeof this.action === "number" && this.action % 1 == 0)
			me.state.change(this.action);
		else if(typeof this.action === "function")
			this.action();
	},
	
	update: function() {
		return this.active;
	},
	
	draw: function(context) {
		if(this.active) {
			var selected = this.containsPointV(me.input.mouse.pos) || this.selected;
			
			if(this.selectionHandler && selected != this.selected && selected) {
				this.selectionHandler.select(this);
				this.selectAnim.reset();
			}
			
			if(selected) this.frame.setBgImage(this.bgImages["on"]);
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
