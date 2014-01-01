game.gui.PopUpFrame = game.gui.Component.extend({
	init: function(text) {
		this.parent(new me.Vector2d(0, 0), me.video.getWidth(), me.video.getHeight());
		this.frame = new game.gui.TextBox({
			text: text, 
			align: "center", 
			frame: true, 
			fitTextH: true, 
			fitTextV: true,
			centeredH: true,
			centeredV: true
		});
		
		this.step = {
			start: 0,
			stop: 30,
			current: 0,
			inc: function() {
				if(this.current >= this.stop)
					return false;
				
				this.current++;
				return true;
			}
		};
		
		function makeAnimArray(options) {
			var options = $.extend({easing: jQuery.easing.easeOutElastic}, options || {});
			var arr = [],
				delta = options.to - options.from,
				frames = options.frames || options.sec * me.sys.fps;
			
			for(var i = 0; i <= frames; i++) 
				arr.push(options.easing(0, i, options.from, delta, frames));
			
			arr[frames] = options.to;
			return arr;
    	}

		this.animScale = makeAnimArray({from: this.step.start, to: 1, frames: this.step.stop});
		this.animAppear = makeAnimArray({from: this.step.start, to:0.6, frames:this.step.stop});
	},
	
	setText: function(text) {
		this.frame.setText(text);
	},
	
	draw: function(context) {
		this.needUpdate = this.step.inc();
		
		this.parent(context, function(ctx) {
			ctx.globalAlpha = this.animAppear[this.step.current];
			ctx.fillStyle = 'black';
			ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
			ctx.globalAlpha = 1;
			
			var width = this.renderedFrame.width,
				height = this.renderedFrame.height,
				posX = 0,
				posY = 0,
				scale = this.animScale[this.step.current];
			
			width = width * scale;
			height = height * scale;
			
			posY = (me.video.getHeight() / 2 - height / 2);
			posX = (me.video.getWidth() / 2 - width / 2);
			
			this.frame.draw(
				posX, posY,
				width, height
			);
		});
		
	}
});
