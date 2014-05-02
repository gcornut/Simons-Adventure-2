
game.gui.Animation = Object.extend({
	init: function(options) {
		var defaults = {
				easing: jQuery.easing.easeOutElastic,
				from: 0,
				to: 1,
				sec: 1
			},
			options = $.extend(defaults, (options || {}));
		
		this.easing = options.easing;
		this.from = options.from;
		this.to = options.to;
		this.frames = options.frames || options.sec * me.sys.fps;
		this.current = -1;
		
		//Create animation array
		this.animArray = new Array(this.frames);
		var delta = this.to - this.from;
		
		jQuery.map(this.animArray, function(frame, i) {
			this.animArray[i] = this.easing(0, i, this.from, delta, this.frames);
		}, this);
		
		this.animArray[this.animArray.length - 1] = this.to;
	},
	
	nextStep: function() {
		return this.current < this.frames - 1 ? this.animArray[++this.current] : this.animArray[this.current];
	},
	
	prevStep: function() {
		return this.current > -1 ? this.animArray[--this.current] : this.animArray[this.current];
	},
	
	isLast: function() {
		return this.current == this.frames - 1;
	},
	
	isFirst: function() {
		return this.current == -1;
	},
	
	reset: function() {
		this.current = -1;
	}
});