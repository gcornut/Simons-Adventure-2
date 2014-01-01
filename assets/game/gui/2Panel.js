
game.gui.Panel = game.gui.Component.extend({

	init: function(options) {
		var defaults = {
				spacing: 30,
				height: 0,
				width: 0,
				layout: game.gui.Panel.VERTICAL,
				components: undefined
			},
			options = $.extend(defaults, (options || {}));
		
		this.spacing = options.spacing;
		this.layout = options.layout;
		this.components = [];
		
		this.parent({
			y: options.y, 
			width: options.width, 
			height: options.height,
			cache: false
		});
		
		
		this.add(options.components);
	},
	
	setSpacing: function(spacing) {
		this.spacing = spacing;
	},
	
	setX: function(x) {
		this.parent(x);
		if(this.layout === game.gui.Panel.VERTICAL) {
			this.components.map(function(cmp) {
			    cmp.centerH({parentX: this.pos.x, parentWidth: this.width});
			}, this);
		}
		else {
			var posX = this.pos.x;
			this.components.map(function(cmp) {
			    cmp.setX(posX);
			    posX += cmp.width + this.spacing;
			}, this);
		}
	},
	
	setY: function(y) {
		this.parent(y);
		if(this.layout === game.gui.Panel.VERTICAL) {
			var posY = this.pos.y;
			this.components.map(function(cmp) {
			    cmp.setY(posY);
			    posY += cmp.height + this.spacing;
			}, this);
		}
		else {
			this.components.map(function(cmp) {
			    cmp.centerV({parentY: this.pos.y, parentHeight: this.height});
			}, this);
		}
	},
	
	add: function(component) {
		if(component != null && component != undefined) {
			
			if(component instanceof Array)
				this.components = this.components.concat(component);
			else this.components.push(component);
			
			var height, width;
			if(this.layout === game.gui.Panel.VERTICAL) {
				height = 0;
				width = this.width;
				    
				this.components.map(function(cmp) {
				    height += cmp.height + this.spacing;
				    width = Math.max(cmp.width, width);
				}, this);
				height -= this.spacing;
			} 
			else {
				height = this.height;
				width = 0;
				    
				this.components.map(function(cmp) {
				    width += cmp.width + this.spacing;
				    height = Math.max(cmp.height, height);
				}, this);
				width -= this.spacing;
			}
			
			if(height != this.height) this.setHeight(height);
			if(width != this.width) this.setWidth(width);
				
			this.setX(this.pos.x);
			this.setY(this.pos.y);
		}
	},
	
	onResetEvent: function() {
		this.components.map(function(cmp) {
			if(cmp != null && cmp != undefined && cmp.onResetEvent != undefined) 
				cmp.onResetEvent();
		}, this);
	},
	
	onDestroyEvent: function() {
		this.components.map(function(cmp) {
			if(cmp != null && cmp != undefined && cmp.onDestroyEvent != undefined) 
				cmp.onDestroyEvent();
		}, this);
	},
			
	draw: function(context) {
		jQuery.map(this.components, function(cmp) {
			cmp.draw(context);
		}, this);
	}
});
game.gui.Panel.VERTICAL = 0;
game.gui.Panel.HORIZONTAL = 1;