game.gui.FramedRect = game.gui.Component.extend({
	/**
	 * parentRect: the Rect around which the TexturedFrame will be drawn	
	 */
	init: function(parentRect, options) {
		var defaults = {
				bgImage: game.gui.getImageFromTexture("bg.png")
			},
			options = $.extend(defaults, (options || {}));
	
		this.parts = ["tr", "tl", "br", "bl", "ht", "hb", "vr", "vl"];
		
		this.sprites = {};
		for(var i = 0; i < this.parts.length; i++) {
			var part = this.parts[i];
			var region = game.guiTexture.getRegion(part+".png");
			this.sprites[part] = new me.SpriteObject(0,0, game.guiTexture.getTexture(), region.width, region.height);
			this.sprites[part].offset.setV(region.offset);
		}
		
		this.padding = {
			top: this.sprites["tr"].height,
			bottom: this.sprites["br"].height,
			right: this.sprites["tr"].width,
			left: this.sprites["tl"].width,
		}
		
		this.parent(this.adaptDimensions({
			x: parentRect.pos.x,
			y: parentRect.pos.y,
			width: parentRect.width, 
			height: parentRect.height
		}));
		
		this.initCornerSpritePos();
		
		if(options.bgColor) this.bgColor = options.bgColor;
		else this.bgImage = options.bgImage;
	},
	
	initCornerSpritePos: function() {
		this.sprites["tr"].pos = new me.Vector2d(0, 0);
		this.sprites["tl"].pos = new me.Vector2d(this.width - this.sprites["tl"].width, 0);
		this.sprites["br"].pos = new me.Vector2d(0, this.height - this.sprites["tl"].height);
		this.sprites["bl"].pos = new me.Vector2d(this.width - this.sprites["tl"].width, this.height - this.sprites["tl"].height);
	},
	
	adaptDimensions: function(values) {
		var values = (values || {});
		
		if(values.width)
			values.width = values.width + this.padding.right + this.padding.left;
		if(values.height)
			values.height = values.height + this.padding.top + this.padding.bottom;
		if(values.x)
			values.x = values.x - this.padding.right;
		if(values.y)
			values.y = values.y - this.padding.top;
			
		return values;
	},
	
	setWidth: function(width) {
		this.parent(this.adaptDimensions({width: width}).width);
	},
	
	setHeight: function(height) {
		this.parent(this.adaptDimensions({height: height}).height);
	},
	
	setX: function(x) {
		this.parent(this.adaptDimensions({x: x}).x);
	},
	
	setY: function(y) {
		this.parent(this.adaptDimensions({y: y}).y);
	},
	
	getPadding: function() {
		return this.padding;	
	},
	
	setBgColor: function(color) {
		if(this.bgColor != color) {
			this.bgColor = color;
			this.needUpdate = true;
			this.bgImage = null;
		}
	},

	getBgColor: function() {
		return this.bgColor;
	},
	
	setBgImage: function(image) {
		if(this.bgImage == undefined || this.bgImage !== image) {
			this.bgImage = image;
			this.needUpdate = true;
		}
	},

	getBgImage: function() {
		return this.bgImage;
	},
	
	draw: function(context) {
		this.parent(
			context, 
			function(ctx) {
				this.initCornerSpritePos();
				
				var topRight = this.sprites["tr"];
				
				if(this.bgImage != undefined && this.bgImage != null)
				    ctx.fillStyle = ctx.createPattern(this.bgImage, 'repeat');
				else
				    ctx.fillStyle = this.bgColor;
				
				ctx.fillRect(
				    topRight.pos.x + (topRight.width / 2),
				    topRight.pos.y + (topRight.height / 2),
				    this.width - (topRight.width),
				    this.height - (this.sprites["tr"].height)
				);
				
				for(var i = 0; i < this.parts.length; i++) {
				    var part = this.parts[i];
				    
				    if(part.indexOf("t") === 0 || part.indexOf("b") === 0)
				    	this.sprites[part].draw(ctx);
				    else {
				    	if(part.indexOf("h") === 0) {
				    		var startX = this.sprites["tr"].pos.x + this.sprites["tr"].width;
				    		var stopX = this.sprites["tl"].pos.x - 1;
				    		
				    		for(var x = startX; x <= stopX; x++) {
				    			this.sprites[part].pos = new me.Vector2d(
				    				x,
				    				(part === "ht") ? 0 : this.sprites["br"].pos.y
				    			);
				    			this.sprites[part].draw(ctx);
				    		}
				    	}
				    	else {
				    		var startY = this.sprites["tr"].pos.y + this.sprites["tr"].height;
				    		var stopY = this.sprites["br"].pos.y - 1;
				    		
				    		for(var y = startY; y <= stopY; y++) {
				    			this.sprites[part].pos = new me.Vector2d(
				    				(part === "vr") ? 0 : this.sprites["bl"].pos.x,
				    				y
				    			);
				    			this.sprites[part].draw(ctx);
				    		}
				    	}
				    }
				}
			},
			this
		);
	}
});
