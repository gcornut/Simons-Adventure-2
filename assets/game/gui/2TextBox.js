
game.gui.TextBox = game.gui.Component.extend({
	
	/**
	 * options:
	 *		options from Components
	 *		text => (string) text too be displayed in the component
	 *		align => (string) text alignement options: ex: "center middle"
	 *		frame => (boolean) true if you want a FramedRect around the TextBox
	 *		lineSpacing => (number) number of pixel between lines
	 */
	init: function(options, frameOptions) {
		var defaults = {
				text: "",
				align: "",
				frame: false,
				lineSpacing: 8
			},
			options = $.extend(defaults, (options || {}));
		
		this.text = options.text.toUpperCase().trim();
		this.lineSpacing = options.lineSpacing;
		this.align = options.align.trim().toUpperCase().split(" ").sort();
		
		this.fitTextH = options.fitTextH;
		this.fitTextV = options.fitTextV;
		
		this.width = options.width;
		this.height = options.height;
		
		this.initText(true);
		
		this.parent($.extend(options, {width: this.width, height: this.height}));
		
		if(options.frame) 
			this.frame = new game.gui.FramedRect(this, frameOptions);
	},
	
	initText: function(initializing) {
		if(this.fitTextH != false && this.width == undefined)
			this.fitTextH = true;
		else
			this.fitTextH = false;
		if(this.fitTextV != false && this.height == undefined)
			this.fitTextV = true;
		else
			this.fitTextV = false;
			
		this.lines = this.text.split("\n");
		
		this.textWidth = 0;
		this.lines.map(function(line) {
			this.textWidth = Math.max(this.textWidth, line.length * game.gui.font.sSize.x);
		}, this);
		
		this.textHeight = this.lines.length * game.gui.font.sSize.x + (this.lineSpacing * (this.lines.length - 1));

		this.textPosX = 0;
		this.textPosY = 0;		
		
		if(this.align.indexOf("CENTER") != -1 && !this.fitTextH) 
			this.textPosX = (this.width / 2) - (this.textWidth / 2);
			
		if(this.align.indexOf("MIDDLE") != -1 && !this.fitTextV) 
			this.textPosY = (this.height / 2) - (this.textHeight / 2);

		this.needUpdate = true;
		
		if(initializing) {
			if(this.fitTextH) this.width = this.textWidth;
			if(this.fitTextV) this.height = this.textHeight;
		} 
		else {
			if(this.fitTextH) this.setWidth(this.textWidth);
			if(this.fitTextV) this.setHeight(this.textHeight);
		}
	},
	
	setWidth: function(width) {
		this.parent(width);
		
		if(this.width != this.textWidth && this.fitTextH) {
			this.fitTextH = false;
			this.initText();
		}
		if(this.frame) this.frame.setWidth(this.width);
	},
	
	setHeight: function(height) {
		this.parent(height);
		
		if(this.height != this.textHeight && this.fitTextV) {
			this.fitTextV = false;
			this.initText();
		}
		if(this.frame) this.frame.setHeight(this.height);
	},
	
	setText: function(text, fitTextH, fitTextV) {
		this.text = text.toUpperCase().trim();
		
		if(fitTextH) this.fitTextH = fitTextH;
		if(fitTextV) this.fitTextV = fitTextV;
		this.initText();
	},
	
	setX: function(x) {
		this.parent(x);
		if(this.frame) this.frame.setX(this.pos.x);
	},
	
	setY: function(y) {
		this.parent(y);
		if(this.frame) this.frame.setY(this.pos.y);
	},
	
	draw: function(context) {
		if(this.frame) this.frame.draw(context);
		
		this.parent(
			context,
			function(ctx) {
			
				/*ctx.rect(0,0, this.width, this.height);
				ctx.strokeStyle = "red";
				ctx.stroke();
				ctx.strokeStyle = "transparent";*/
				
				var posY = this.textPosY,
			        posX = this.textPosX;
			    
			    if(this.lines.length > 1) {
				    this.lines.map(function(line) {
			            if(this.align[0] === "CENTER")
			            	posX = this.textPosX + (this.textWidth / 2) - (line.length * game.gui.font.sSize.x / 2);
			            
			            game.gui.font.draw(ctx, line, posX, posY);
			            posY += this.lineSpacing + game.gui.font.sSize.x;
			        }, this); 
			    }
			    else game.gui.font.draw(ctx, this.lines[0], posX, posY);   
			},
			this
		);
	}	
});
