game.gui.screen.ComplexScreen = me.ScreenObject.extend({
	
	init: function(topPadding, spacing) {
		this.parent(true);
		
		this.panel = new game.gui.Panel({y: topPadding, spacing: spacing});
		
		//this.needUpdate = true;
		//me.input.bindKey(me.input.KEY.ENTER, "enter", true); 
	},
	
	update: function() {
		return true; //this.needUpdate;
	},
	
	add: function(component) {
		this.panel.add(component);
	},
	
	onResetEvent: function() {
		/*me.input.registerPointerEvent("mousemove", this, (function() {
			this.needUpdate = true;
			setTimeout(jQuery.proxy(function() {
				this.needUpdate = false;
			}, this), 1000);
		}).bind(this));*/
		
		this.panel.onResetEvent();
	},
 
	onDestroyEvent: function() {
		//me.input.releasePointerEvent("mousemove", this);
		
		this.panel.onDestroyEvent();
	},
 
	draw: function(context) {
		this.panel.draw(context);
	}
});