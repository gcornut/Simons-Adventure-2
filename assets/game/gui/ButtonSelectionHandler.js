game.gui.ButtonSelectionHandler = Object.extend({
	
	init: function(options) {
		var options = options || {};
		
		this.buttons = [];
		this.add(options.buttons);
		
		this.layout = options.layout;
		
		this.selectedButton = undefined;
		this.onResetEvent();
	},
	
	removeAll: function() {
		this.buttons = [];	
	},
	
	remove: function(button) {
		if(this.selectedButton == button)
			this.selectedButton = undefined;
		this.buttons.remove(button);
	},
	
	add: function(button, pos) {
		if(button && this.buttons.indexOf(button) == -1) {
			
			if(button instanceof Array) {
				this.buttons = this.buttons.concat(button);
				
				jQuery.map(this.buttons, function(i, btn) {
			    	btn.selectionHandler = this;
			    }, this);
			}
			else {
				if(pos) 
					this.buttons[pos] = button;
				else
					this.buttons.push(button);
					
				button.selectionHandler = this;
			}
			
			this.deSelectAll();
		}
		this.onResetEvent();
	},
	
	deSelectAll: function() {
		jQuery.map(this.buttons, function(i, btn) {
		    btn.selected = false;
		}, this);
		this.selectedButton = undefined;
	},
	
	select: function(button) {
		var index = (typeof button === "number") ? button : this.buttons.indexOf(button);
		var button = this.buttons[index];
		if(index >= 0) {
			jQuery.map(this.buttons, function(btn) {
				if(btn === button) {
					btn.selected = true;
					this.selectedButton = button;
				}
				else btn.selected = false;
			}, this);
		}
	},
	
	update : function() {
		var index;
			
		if(me.input.isKeyPressed("right") || me.input.isKeyPressed("down")) {
			index = this.buttons.indexOf(this.selectedButton);
			index = index == -1 ? 0 : Math.min(index+1, this.buttons.length-1);
		} else if(me.input.isKeyPressed("left") || me.input.isKeyPressed("up")) {
			index = this.buttons.indexOf(this.selectedButton);
			index = index == -1 ? 0 : Math.max(index-1, 0);
		}
		
		if(index >= 0) {
			this.select(index);
		}
		
		if(me.input.isKeyPressed("enter") && this.selectedButton) {
			this.selectedButton.clicked();
		}	
	},
	
	onResetEvent: function() {
		if(this.buttons.length > 0 && this.layout != undefined) {
			if(this.layout == game.gui.Panel.VERTICAL) {
				me.input.bindKey(me.input.KEY.UP, "up", true);
				me.input.bindKey(me.input.KEY.DOWN, "down", true);
				
				me.input.bindKey(me.input.KEY.ENTER, "enter");
			} /*else {
				me.input.bindKey(me.input.KEY.LEFT,	"left");
				me.input.bindKey(me.input.KEY.RIGHT, "right");
			}*/
		}
	},
	
	onDestroyEvent: function() {
		if(this.buttons.length > 0 && this.layout != undefined) {
			if(this.layout == game.gui.Panel.VERTICAL) {
				me.input.unbindKey(me.input.KEY.UP);
				me.input.unbindKey(me.input.KEY.DOWN);
				
				me.input.unbindKey(me.input.KEY.ENTER);
			} /*else {
				me.input.unbindKey(me.input.KEY.LEFT);
				me.input.unbindKey(me.input.KEY.RIGHT);
			}*/
		}
	},
});