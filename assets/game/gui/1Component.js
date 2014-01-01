/** Basic GUI object that can be centered if no position is declared */
game.gui.Component = me.Rect.extend({

	/**
	 * options:
	 *		x => (int) position in X
	 *		y => (int) position in Y
	 *		pos => (me.Vector2d) 2D vector position
	 *		width => (int) width
	 *		height => (int) height
	 *		centeredH => (boolean) true if need to be centered horizontally
	 *		centeredV => (boolean) true if need to be centered vertically
	 *		cache => (boolean) true if the component should be cached
	 */
	init: function(options) {
		var defaults = {
				centeredH: false,
				centeredV: false,
				cache: true
			},
			options = $.extend(defaults, (options || {}));
		
		// Position vector or position x & position y
		if(options.pos) {
			this.pos = options.pos;
		}
		else {
			this.pos = new me.Vector2d(options.x, options.y);
			if(options.x == undefined) this.centerH();
			if(options.y == undefined) this.centerV();
		}
		
		//Width & Height
		this.width = options.width;
		this.height = options.height;

		// Centered horizontally
		if(options.centeredH != false && !this.centeredH) this.centerH();
		
		// Centered vertically
		if(options.centeredV != false && !this.centeredV) this.centerV();
	
		this.parent(this.pos, this.width, this.height);
		
		if(options.cache) {	
			this.needUpdate = true;
	
			this.cache = document.createElement("canvas");
			this.cache.context = this.cache.getContext("2d");
			
			this.cache.height = this.height;
			this.cache.width = this.width;	
		}
	},
	
	centerV: function(options) {
		var options = $.extend(
				{parentY: 0, parentHeight: me.video.getHeight()}, 
				(options || {})
			);
			
		this.setY(options.parentY + (options.parentHeight / 2 - (this.height == undefined ? 0 : this.height / 2)));
		
		if(arguments.length == 0) {
			this.centeredV = true;
		} else {
			this.centeredV = false;
		}
		
		return this.pos.y;
	},
	
	centerH: function(options) {
		var options = $.extend(
				{parentX: 0, parentWidth: me.video.getWidth()}, 
				(options || {})
			);
			
		this.setX(options.parentX + (options.parentWidth / 2 - (this.width == undefined ? 0 : this.width / 2)));
		
		if(arguments.length == 0) {
			this.centeredH = true;
		} else {
			this.centeredH = false;
		}
		
		return this.pos.x;
	},
	
	setWidth: function(width) {
		this.width = width;
		if(this.centeredH) this.centerH();
		
		if(this.cache) {
			this.needUpdate = true;
			this.cache.width = this.width;
		}
	},
	
	setHeight: function(height) {
		this.height = height;
		if(this.centeredV) this.centerV();
		if(this.cache) {
			this.needUpdate = true;
			this.cache.height = this.height;
		}
	},
	
	setX: function(x) {
		this.pos.x = x;
		this.centeredH = false;
	},
	
	setY: function(y) {
		this.pos.y = y;
		this.centeredV = false;
	},
	
	draw: function(context, drawing, thisCallback) {
		if(this.cache) {
			if(!this.needUpdate) {
				//context.clearRect(this.pos.x, this.pos.y, this.width, this.height);
				context.drawImage(this.cache.context.canvas, this.pos.x, this.pos.y);
				return;
			}
			
			this.cache.context.clearRect(0, 0, this.width, this.height);
			try {		
				jQuery.proxy(drawing, thisCallback)(this.cache.context);	
			} catch(e) {console.log(e);}
			
			this.needUpdate = false;
			this.draw(context, drawing);
		}
		else {
			try {		
				jQuery.proxy(drawing, thisCallback)(context);	
			} catch(e) {console.log(e);}
		}
	}
});